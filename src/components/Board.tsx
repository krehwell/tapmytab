import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { SortableCard } from './Card'
import { TBoard } from '../types'
import { FlexColumn, FlexColumnAlignJustifyCenter, FlexRowAlignCenter } from './Flex'

export const Board = ({ board, style }: { board: TBoard; style?: React.CSSProperties }) => {
    const { cards, id, title } = board

    const { setNodeRef } = useDroppable({ id: board.id })

    return (
        <FlexColumn style={{ width: 300, backgroundColor: '#2B2F32', borderRight: '6px solid #313436', ...style }}>
            <FlexRowAlignCenter style={{ justifyContent: 'space-between', marginBottom: '24px', padding: '12px' }}>
                <h2 style={{ fontSize: '31px', fontWeight: '700' }}>{title}</h2>
                <FlexColumnAlignJustifyCenter
                    as="button"
                    style={{ height: '24px', width: '24px', fontSize: '24px', color: '#54575A' }}
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
