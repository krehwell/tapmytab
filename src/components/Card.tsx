import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TCard } from '../types'
import { FlexColumn, FlexRowAlignCenter } from './Flex'
import { Editor, useEditorInstance } from './Editor'
import { tc } from '../utils/themeColors'
import { useCardPopupStore } from './CardPopup'
import { Button } from './Button'
import { ArrowsOutSimple } from 'phosphor-react'
import type { Editor as TiptapEditor } from '@tiptap/react'
import { Label } from './Label'

export const Card = ({
    card,
    disabled,
    style,
    sortableCheat,
}: {
    card: TCard
    style?: React.CSSProperties
    disabled?: boolean
    sortableCheat: string
}) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: card.id,
        data: { card, sortableCheat },
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
                ...(isDragging ? { opacity: 0.5 } : {}),
                ...style,
            }}
        >
            {/* CARD HEADER */}
            <FlexColumn
                onClick={() => openPopup({ card })}
                style={{
                    padding: '0 0.4rem',
                    paddingBottom: '1.2rem',
                    gap: '0.4rem',
                    cursor: disabled ? 'grabbing' : 'default',
                }}
                {...attributes}
                {...listeners}
            >
                <FlexRowAlignCenter>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{card.title}</h2>
                    <Button radius="3rem" sx={{ marginLeft: 'auto' }}>
                        <ArrowsOutSimple size={18} />
                    </Button>
                </FlexRowAlignCenter>
                <p style={{ fontSize: '1.3rem', color: tc.textActiveSecondary }}>{card.desc}</p>
                {card.label && <Label label={card.label} /> }
            </FlexColumn>

            <Editor
                editor={editor as TiptapEditor}
                style={{
                    overflow: 'hidden auto',
                    backgroundColor: '#2C3034',
                    borderRadius: '0.8rem',
                    minHeight: '15.8rem',
                    maxHeight: '21.7rem',
                }}
            />
        </FlexColumn>
    )
}
