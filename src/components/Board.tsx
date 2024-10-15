import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Card } from './Card'
import { TBoard } from '../types'
import { FlexColumn, FlexColumnAlignJustifyCenter, FlexRowAlignCenter } from './Flex'
import ContentEditable from 'react-contenteditable'

const EMPTY_TITLE = 'add title...'

export const Board = ({
    board: { cards, id, title: initialTitle },
    style,
    onNewCreated,
}: {
    board: Omit<TBoard, 'id'> & { id: string | null }
    style?: React.CSSProperties
    onNewCreated?: ({ id }: { id: string }) => void
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
                width: 300,
                backgroundColor: '#2B2F32',
                borderRight: '6px solid #313436',
                flexShrink: 0,
                ...style,
            }}
        >
            <FlexRowAlignCenter
                style={{ justifyContent: 'space-between', marginBottom: '24px', padding: '12px 12px 0' }}
            >
                <ContentEditable
                    style={{ fontSize: 31, fontWeight: '700', opacity: isPlaceholder ? 0.4 : 1 }}
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
                                onNewCreated({ id: newTitle })
                                resetBoard()
                            }
                        } else {
                            setHasEdited(false)
                            setTitle(EMPTY_TITLE)
                        }
                    }}
                    html={title}
                />
                <FlexColumnAlignJustifyCenter
                    as="button"
                    style={{
                        height: '20px',
                        width: '20px',
                        fontSize: '24px',
                        color: '#54575A',
                        display: isPlaceholder ? 'none' : 'flex',
                    }}
                >
                    +
                </FlexColumnAlignJustifyCenter>
            </FlexRowAlignCenter>

            <SortableContext id={id as string} items={cards} strategy={verticalListSortingStrategy}>
                <FlexColumn
                    ref={setNodeRef}
                    style={{ gap: '12px', maxHeight: '100%', padding: '12px', overflowY: 'auto', overflowX: 'hidden' }}
                >
                    {cards.map((card) => {
                        return <Card key={card.id} card={card} />
                    })}
                </FlexColumn>
            </SortableContext>
        </FlexColumn>
    )
}
