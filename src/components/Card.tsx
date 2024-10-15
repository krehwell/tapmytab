import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TCard } from '../types'

export const SortableCard = ({
    card,
    disabled,
    style,
}: {
    card: TCard
    style?: React.CSSProperties
    disabled?: boolean
}) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: card.id, disabled })

    const mergedStyle = {
        transform: CSS.Transform.toString(transform),
        transition,
        width: '100%',
        height: 50,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '1px solid black',
        margin: '10px 0',
        background: 'white',
        ...style,
    }

    return (
        <div ref={setNodeRef} style={mergedStyle} {...attributes} {...listeners}>
            {card.id}
        </div>
    )
}
