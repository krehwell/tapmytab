import React, { useState } from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { SortableCard } from './Card'
import { TBoard } from '../types'
import { FlexColumn, FlexColumnAlignJustifyCenter, FlexRowAlignCenter } from './Flex'
import ContentEditable from 'react-contenteditable'

export const Board = ({
    board: { cards, id, title: initialTitle },
    style,
}: {
    board: TBoard
    style?: React.CSSProperties
}) => {
    const [title, setTitle] = useState<string>(initialTitle || 'add title...')
    const [hasEdited, setHasEdited] = useState<boolean>(false)
    const isEmpty = cards.length === 0
    const isPlaceholder = isEmpty && !hasEdited

    const { setNodeRef } = useDroppable({ id, disabled: isPlaceholder })

    return (
        <FlexColumn style={{ width: 300, backgroundColor: '#2B2F32', borderRight: '6px solid #313436', ...style }}>
            <FlexRowAlignCenter
                style={{ justifyContent: 'space-between', marginBottom: '24px', padding: '12px 12px 0' }}
            >
                <ContentEditable
                    style={{ fontSize: '31px', fontWeight: '700', opacity: isPlaceholder ? 0.4 : 1 }}
                    onFocus={() => {
                        if (!hasEdited) {
                            setTitle('')
                        }
                    }}
                    onChange={(e) => {
                        if (!hasEdited) setHasEdited(true)
                        setTitle(e.target.value || '')
                    }}
                    onBlur={(e) => {
                        if (e.target.innerText) {
                            setTitle(e.target.innerText)
                        } else {
                            setHasEdited(false)
                            setTitle('add title...')
                        }
                    }}
                    html={title}
                />
                <FlexColumnAlignJustifyCenter
                    as="button"
                    style={{ height: '20px', width: '20px', fontSize: '24px', color: '#54575A' }}
                >
                    +
                </FlexColumnAlignJustifyCenter>
            </FlexRowAlignCenter>

            <SortableContext id={id} items={cards} strategy={verticalListSortingStrategy}>
                <FlexColumn
                    ref={setNodeRef}
                    className="faq-body"
                    style={{ gap: '12px', maxHeight: '100%', padding: '12px', overflowY: 'auto', overflowX: 'hidden' }}
                >
                    {cards.map((card) => {
                        return <SortableCard key={card.id} card={card} />
                    })}
                </FlexColumn>
            </SortableContext>
        </FlexColumn>
    )
}
