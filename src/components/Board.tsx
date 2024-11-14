import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card } from './Card'
import { TBoard } from '../types'
import { FlexColumn, FlexColumnAlignJustifyCenter, FlexRowAlignCenter } from './Flex'
import ContentEditable from 'react-contenteditable'
import { Button } from './Button'
import { tc } from '../utils/themeColors'

const EMPTY_TITLE = 'add title...'

export const Board = ({
    board: { cards, id, title: initialTitle },
    index,
    style,
    onNewCreated,
}: {
    board: Omit<TBoard, 'id'> & { id: string | null }
    index: number
    style?: React.CSSProperties
    onNewCreated?: (props: { id: string; index: number }) => void
}) => {
    const [title, setTitle] = useState<string>(initialTitle || EMPTY_TITLE)
    const [hasEdited, setHasEdited] = useState<boolean>(initialTitle ? true : false)
    const isEmpty = cards.length === 0
    const isPlaceholder = isEmpty && !hasEdited

    const { setNodeRef } = useDroppable({ id: id as string, disabled: isPlaceholder })

    const resetBoard = () => {
        setTitle(EMPTY_TITLE)
        setHasEdited(false)
    }

    return (
        <FlexColumn
            style={{
                width: '30rem',
                padding: '1.2rem',
                paddingLeft: index === 0 ? '0px' : '1.2rem',
                flexShrink: 0,
                ...style,
            }}
        >
            <FlexRowAlignCenter style={{ justifyContent: 'space-between', marginBottom: '2.4rem' }}>
                <ContentEditable
                    style={{ fontSize: 31, fontWeight: '700', opacity: isPlaceholder ? 0.4 : 1, flex: 1 }}
                    onFocus={() => {
                        if (isPlaceholder) {
                            setTitle('')
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.currentTarget.blur()
                        }
                    }}
                    onChange={(e) => {
                        if (!hasEdited) setHasEdited(true)
                        setTitle(e.target.value || '')
                    }}
                    onBlur={(e) => {
                        const newTitle = e.target.innerText
                        // new board created
                        if (newTitle) {
                            setTitle(newTitle)
                            if (onNewCreated && !id) {
                                onNewCreated({ id: newTitle, index: index + 1 })
                                resetBoard()
                            }
                        } else {
                            setHasEdited(false)
                            setTitle(EMPTY_TITLE)
                        }
                    }}
                    html={title}
                />
                <Button
                    radius="2.8rem"
                    style={{
                        backgroundColor: tc.bgPrimary,
                    }}
                >
                    ...
                </Button>
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
                    {cards.map((card) => {
                        return <Card key={card.id} card={card} />
                    })}
                </FlexColumn>
            </SortableContext>
        </FlexColumn>
    )
}
