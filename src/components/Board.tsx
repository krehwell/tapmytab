import React from 'react'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

import { SortableCard } from './Card'
import { TBoard } from '../types'

export const Board = ({ board, style }: { board: TBoard; style?: React.CSSProperties }) => {
    const { cards, id, title } = board

    const { setNodeRef } = useDroppable({ id: board.id })

    return (
        <SortableContext id={id} items={cards} strategy={verticalListSortingStrategy}>
            <div ref={setNodeRef} style={{ background: '#dadada', padding: 10, margin: 10, flex: 1, ...style }}>
                {cards.map((card) => {
                    return <SortableCard key={card.id} card={card} />
                })}
            </div>
        </SortableContext>
    )
}
