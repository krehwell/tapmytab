import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card } from './Card'
import { TBoard } from '../types'
import { FlexColumn, FlexRowAlignCenter } from './Flex'
import { Button } from './Button'
import { tc } from '../utils/themeColors'
import { Copy, DotsThree, Plus, Trash } from 'phosphor-react'
import TextareaAutosize, { TextareaAutosizeProps } from '@mui/material/TextareaAutosize'
import { WithMenuOption, WithOptionsMenu } from './WithOptionsMenu'
import { createSortableCheat } from '../utils/dndIdManager'

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
            placeholder={'Add title...'}
            style={{
                fontSize: 31,
                fontWeight: '700',
                opacity: disabled ? 0.4 : 1,
                flex: 1,
                backgroundColor: 'transparent',
                resize: 'none',
                ...style,
            }}
            {...props}
        />
    )
}

const BoardOptions = () => {
    const options: WithMenuOption[] = [
        {
            label: 'Add Card',
            onClick: () => alert('Add new card'),
            node: (
                <FlexRowAlignCenter style={{ gap: '0.8rem', color: 'inherit' }}>
                    <Plus size={12} color="#4C5257" /> Add Card
                </FlexRowAlignCenter>
            ),
        },
        {
            label: 'Duplicate Board',
            onClick: () => alert('Duplicate a board to besides'),
            node: (
                <FlexRowAlignCenter style={{ gap: '0.8rem', color: 'inherit' }}>
                    <Copy size={12} color="#4C5257" /> Duplicate Board
                </FlexRowAlignCenter>
            ),
        },
        {
            label: 'Delete Board',
            onClick: () => alert('Delete this board'),
            node: (
                <FlexRowAlignCenter style={{ gap: '0.8rem', color: 'inherit' }}>
                    <Trash size={12} color="#4C5257" /> Delete Board
                </FlexRowAlignCenter>
            ),
        },
    ]

    return (
        <WithOptionsMenu options={options}>
            {({ openMenu }) => {
                return (
                    <Button radius="2.8rem" style={{ backgroundColor: tc.bgPrimary }} onClick={openMenu}>
                        <DotsThree size={22} weight="bold" />
                    </Button>
                )
            }}
        </WithOptionsMenu>
    )
}

export const Board = ({
    board,
    index,
    style,
    onNewCreated,
}: {
    board: Omit<TBoard, 'id'> & { id: string | null }
    index: number
    style?: React.CSSProperties
    onNewCreated?: (props: { id: string; index: number }) => void
}) => {
    const { cards, id, title: initialTitle } = board
    const [title, setTitle] = useState<string>(initialTitle || '')
    const [hasEdited, setHasEdited] = useState<boolean>(initialTitle ? true : false)
    const isEmpty = cards.length === 0
    const isPlaceholder = isEmpty && !hasEdited

    const { setNodeRef } = useDroppable({ id: id as string, disabled: false })

    const resetBoard = () => {
        setTitle('')
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
            <FlexRowAlignCenter style={{ justifyContent: 'space-between', marginBottom: '2.4rem' }}>
                <BoardNameInput
                    value={title}
                    disabled={false}
                    onChange={(e) => {
                        if (!hasEdited) setHasEdited(true)
                        setTitle(e.target.value)
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.currentTarget.blur()
                        }
                    }}
                    onBlur={(e) => {
                        const newTitle = e.target.value
                        // new board created
                        if (newTitle) {
                            setTitle(newTitle)
                            if (onNewCreated && !id) {
                                onNewCreated({ id: newTitle, index: index + 1 })
                                resetBoard()
                            }
                        } else {
                            setHasEdited(false)
                        }
                    }}
                />
                {!isPlaceholder && <BoardOptions />}
            </FlexRowAlignCenter>

            {/* CARD LIST */}
            <SortableContext id={id as string} items={cards} strategy={verticalListSortingStrategy}>
                <FlexColumn
                    ref={setNodeRef}
                    style={{
                        gap: '1.2rem',
                        maxHeight: '100%',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        // less cards make it hard to trigger moving. this way we make the droppable section bigger when there's only-1/no-cards in it
                        height: cards.length <= 1 ? '100%' : 'fit-content',
                    }}
                >
                    {cards.map((card, i) => {
                        const boardId = board.id as string
                        const boardIdx = index
                        const cardId = card.id
                        const cardIdx = i
                        const sortableCheat = createSortableCheat({ boardId, cardId, boardIdx, cardIdx })
                        return <Card key={cardId} sortableCheat={sortableCheat} card={card} />
                    })}
                </FlexColumn>
            </SortableContext>
        </FlexColumn>
    )
}
