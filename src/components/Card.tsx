import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TCard, TLabel } from '../types'
import { FlexColumn } from './Flex'
import { getLabelFromColor } from '../utils/getColorFromLabel'
import { Editor } from './Editor'

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
            title="label priority"
        >
            &nbsp;
        </span>
    )
}

export const Card = ({ card, disabled, style }: { card: TCard; style?: React.CSSProperties; disabled?: boolean }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: card.id,
        data: card,
        disabled,
    })

    return (
        <FlexColumn
            ref={setNodeRef}
            className="hover:outline-dashed hover:outline-1 hover:outline-slate-300"
            style={{
                boxSizing: 'border-box',
                transform: CSS.Transform.toString(transform),
                transition,
                padding: 8,
                backgroundColor: '#343A40',
                borderRadius: '12px',
                ...(isDragging ? { opacity: 0.7 } : {}),
                ...style,
            }}
        >
            <FlexColumn style={{ padding: '8px 4px', marginBottom: '4px' }} {...attributes} {...listeners}>
                <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '4px' }}>{card.title}</h2>
                <p style={{ fontSize: '13px', color: 'rgba(248, 249, 250, 0.80)', marginBottom: '4px' }}>{card.desc}</p>
                <Label label={card.label} />
            </FlexColumn>
            <Editor
                content={card.content}
                style={{
                    backgroundColor: '#2C3034',
                    borderRadius: '0.8rem',
                    minHeight: '15.8rem',
                    padding: '1.6rem 0.8rem',
                }}
            />
        </FlexColumn>
    )
}
