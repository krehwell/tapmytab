import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TCard, TLabel } from '../types'
import { FlexColumn } from './Flex'
import { getLabelFromColor } from '../utils/getColorFromLabel'

const Label = ({ label }: { label?: TLabel }) => {
    if (!label) return null

    return (
        <span
            style={{
                width: '43px',
                height: '10px',
                backgroundColor: getLabelFromColor({ label }),
                borderRadius: '4px',
                marginBottom: '4px',
            }}
        >
            &nbsp;
        </span>
    )
}

export const SortableCard = ({
    card,
    disabled,
    style,
}: {
    card: TCard
    style?: React.CSSProperties
    disabled?: boolean
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: card.id,
        data: card,
        disabled,
    })

    return (
        <FlexColumn
            ref={setNodeRef}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                padding: 8,
                backgroundColor: '#343A40',
                borderRadius: '12px',
                ...(isDragging ? { opacity: 0.7 } : {}),
                ...style,
            }}
            {...attributes}
            {...listeners}
        >
            <FlexColumn style={{ padding: '8px 4px', marginBottom: '4px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{card.title}</h2>
                <p style={{ fontSize: '13px', color: 'rgba(248, 249, 250, 0.80)', marginBottom: '4px' }}>{card.desc}</p>
                <Label label={card.label} />
            </FlexColumn>
            <FlexColumn
                dangerouslySetInnerHTML={{ __html: card.content }}
                style={{
                    padding: '16px 8px',
                    backgroundColor: '#2C3034',
                    borderRadius: '8px',
                    fontSize: '13px',
                }}
            />
        </FlexColumn>
    )
}
