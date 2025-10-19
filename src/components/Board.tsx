import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card } from './Card.tsx'
import { TBoard } from '../types.ts'
import { Flex, FlexColumn, FlexRowAlignCenter } from './Flex/index.tsx'
import { Button } from './Button.tsx'
import { tc } from '../utils/themeColors.ts'
import { Copy, DotsThree, Plus, Trash } from '@phosphor-icons/react'
import TextareaAutosize, { TextareaAutosizeProps } from '@mui/material/TextareaAutosize'
import { WithMenuOption, WithOptionsMenu } from './WithOptionsMenu.tsx'
import { createSortableCheat } from '../utils/dndIdManager.ts'
import { useBoardStore } from '../stores/useBoardStore.ts'
import { genUid } from 'light-uid'

type RegularBoardProps = {
    index: number
    board: TBoard
    style?: React.CSSProperties
    isPlaceholder?: never
}

type PlaceholderBoardProps = {
    index: number
    isPlaceholder: boolean
    board?: never
    style?: never
}

type BoardProps = RegularBoardProps | PlaceholderBoardProps

export const Board = ({ board, index, style, isPlaceholder }: BoardProps) => {
    const [name, setName] = useState<string>(board?.name || '')
    const [hasEdited, setHasEdited] = useState<boolean>(false)

    const addNewBoard = useBoardStore((s) => s.addNewBoard)
    const changeBoardName = useBoardStore((s) => s.changeBoardName)

    const resetBoard = () => {
        setName('')
        setHasEdited(false)
    }

    return (
        <FlexColumn
            style={{
                width: '30rem',
                padding: '1.2rem',
                paddingLeft: index === 0 ? '0px' : '1.2rem',
                paddingBottom: 0,
                flexShrink: 0,
                ...style,
            }}
        >
            <Flex style={{ justifyContent: 'space-between', marginBottom: '2.4rem' }}>
                <BoardNameInput
                    value={name}
                    disabled={false}
                    onChange={(e) => {
                        if (!hasEdited) setHasEdited(true)
                        setName(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') e.currentTarget.blur()
                    }}
                    onBlur={(e) => {
                        const newTitle = e.target.value

                        if (isPlaceholder && newTitle) {
                            addNewBoard({
                                name: newTitle,
                                idx: index + 1,
                                id: genUid(8),
                            })
                            resetBoard()
                        }

                        if (board && newTitle !== board.name) {
                            changeBoardName({ name: newTitle, idx: index })
                            setHasEdited(false)
                        }
                    }}
                />
                {!isPlaceholder && <BoardOptions index={index} />}
            </Flex>

            {/* CARD LIST */}
            {board && <SortableCardList board={board} index={index} />}
        </FlexColumn>
    )
}

const SortableCardList = (
    { board, index }: { board: TBoard; index: number },
) => {
    const { setNodeRef } = useDroppable({ id: board.id, disabled: false })
    const cards = board.cards

    return (
        <SortableContext
            id={board.id}
            items={cards}
            strategy={verticalListSortingStrategy}
        >
            <FlexColumn
                ref={setNodeRef}
                style={{
                    gap: '1.2rem',
                    maxHeight: '100%',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    // less cards make it hard to trigger moving. this way we make the droppable section bigger when there's only-1/no-cards in it
                    height: cards.length <= 1 ? '100%' : 'fit-content',
                    paddingBottom: '2.4rem',
                }}
            >
                {cards.map((card, i) => {
                    const boardId = board.id
                    const boardIdx = index
                    const cardId = card.id
                    const cardIdx = i
                    const sortableCheat = createSortableCheat({
                        boardId,
                        cardId,
                        boardIdx,
                        cardIdx,
                    })
                    return (
                        <Card
                            key={cardId}
                            sortableCheat={sortableCheat}
                            card={card}
                        />
                    )
                })}
            </FlexColumn>
        </SortableContext>
    )
}

const BoardNameInput = ({
    disabled,
    style,
    ...props
}: TextareaAutosizeProps & {
    disabled?: boolean
}) => {
    return (
        <TextareaAutosize
            maxRows={2}
            placeholder='Type a name...'
            style={{
                fontSize: 31,
                fontWeight: '700',
                opacity: disabled ? 0.4 : 1,
                flex: 1,
                backgroundColor: 'transparent',
                resize: 'none',
                textOverflow: 'ellipsis',
                outline: 'none',
                ...style,
            }}
            {...props}
        />
    )
}

const BoardOptions = ({ index }: { index: number }) => {
    const addNewCard = useBoardStore((s) => s.addNewCard)
    const deleteBoard = useBoardStore((s) => s.deleteBoard)
    const duplicateBoard = useBoardStore((s) => s.duplicateBoard)

    const options: WithMenuOption[] = [
        {
            label: 'Add Card',
            onClick: () => addNewCard({ idx: index }),
            node: (
                <FlexRowAlignCenter style={{ gap: '0.8rem', color: 'inherit' }}>
                    <Plus size={12} /> Add Card
                </FlexRowAlignCenter>
            ),
        },
        {
            label: 'Duplicate Board',
            onClick: () => duplicateBoard({ idx: index }),
            node: (
                <FlexRowAlignCenter style={{ gap: '0.8rem', color: 'inherit' }}>
                    <Copy size={12} /> Duplicate Board
                </FlexRowAlignCenter>
            ),
        },
        {
            label: 'Delete Board',
            onClick: () => deleteBoard({ idx: index }),
            node: (
                <FlexRowAlignCenter style={{ gap: '0.8rem', color: 'inherit' }}>
                    <Trash size={12} /> Delete Board
                </FlexRowAlignCenter>
            ),
        },
    ]

    return (
        <WithOptionsMenu options={options}>
            {({ openMenu }) => {
                return (
                    <Button
                        radius='2.8rem'
                        style={{ backgroundColor: tc.bgPrimary, marginTop: '0.7rem' }}
                        onClick={openMenu}
                    >
                        <DotsThree
                            size={22}
                            weight='bold'
                            style={{ flexShrink: 0 }}
                        />
                    </Button>
                )
            }}
        </WithOptionsMenu>
    )
}
