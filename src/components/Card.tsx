import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TCard, TLabel } from '../types'
import { FlexColumn } from './Flex'
import { getColorFromLabel } from '../utils/getColorFromLabel'
import { Editor } from './Editor'
import { tc } from '../utils/themeColors'

const Label = ({ label }: { label?: TLabel }) => {
    if (!label) return null

    return (
        <span
            style={{
                width: '5.1rem',
                height: '1.8rem',
                padding: '0.4rem',
                backgroundColor: tc.tokenGrey,
                borderRadius: '4px',
            }}
            title="label priority"
        >
            <div style={{ height: '1rem', borderRadius: '0.4rem', backgroundColor: getColorFromLabel({ label }) }} />
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
            style={{
                boxSizing: 'border-box',
                transform: CSS.Transform.toString(transform),
                transition,
                padding: '1.6rem 0.8rem',
                backgroundColor: tc.bgPrimary,
                borderRadius: '12px',
                ...(isDragging ? { opacity: 0.7 } : {}),
                ...style,
            }}
        >
            {/* CARD HEADER */}
            <FlexColumn
                style={{ padding: '0 0.4rem', marginBottom: '1.2rem', gap: '0.4rem', cursor: 'default' }}
                {...attributes}
                {...listeners}
            >
                <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{card.title}</h2>
                <p style={{ fontSize: '1.3rem', color: tc.textActiveSecondary }}>{card.desc}</p>
                <Label label={card.label} />
            </FlexColumn>

            <Editor
                content={card.content}
                style={{
                    backgroundColor: '#2C3034',
                    borderRadius: '0.8rem',
                    minHeight: '15.8rem',
                    maxHeight: '21.7rem',
                    fontSize: '1.3rem',
                    padding: '1.6rem 0.8rem',
                }}
            />
        </FlexColumn>
    )
}
