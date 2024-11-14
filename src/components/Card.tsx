import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TCard, TLabel } from '../types'
import { FlexColumn, FlexRowAlignCenter } from './Flex'
import { getColorFromLabel } from '../utils/getColorFromLabel'
import { Editor, useEditorInstance } from './Editor'
import { tc } from '../utils/themeColors'
import { useCardPopupStore } from './CardPopup'
import { Button } from './Button'
import { ArrowsOutSimple } from 'phosphor-react'
import type { Editor as TiptapEditor } from '@tiptap/react'

export const Label = ({ label, style }: { label?: TLabel; style?: React.CSSProperties }) => {
    if (!label) return null

    return (
        <span
            style={{
                width: '5.1rem',
                height: '1.8rem',
                padding: '0.4rem',
                backgroundColor: tc.tokenGrey,
                borderRadius: '4px',
                ...style,
            }}
            title="label priority"
        >
            <div style={{ height: '1rem', borderRadius: '0.4rem', backgroundColor: getColorFromLabel({ label }) }} />
        </span>
    )
}

export const Card = ({
    card,
    disabled,
    style,
    isPreview,
}: {
    card: TCard
    style?: React.CSSProperties
    disabled?: boolean
    isPreview?: boolean
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: card.id,
        data: card,
        disabled,
    })

    const { editor } = useEditorInstance({ content: card.content }) as { editor: TiptapEditor }
    const openPopup = useCardPopupStore((s) => s.openPopup)

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
                onClick={() => openPopup({ card, editor })}
                style={{
                    padding: '0 0.4rem',
                    paddingBottom: '1.2rem',
                    gap: '0.4rem',
                    cursor: isPreview ? 'grabbing' : 'default',
                }}
                {...attributes}
                {...listeners}
            >
                <FlexRowAlignCenter>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{card.title}</h2>
                    <Button radius="3rem" sx={{ marginLeft: 'auto' }} onClick={() => openPopup({ card, editor })}>
                        <ArrowsOutSimple size={18} />
                    </Button>
                </FlexRowAlignCenter>
                <p style={{ fontSize: '1.3rem', color: tc.textActiveSecondary }}>{card.desc}</p>
                <Label label={card.label} />
            </FlexColumn>

            <Editor
                editor={editor as TiptapEditor}
                style={{
                    overflow: 'hidden auto',
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
