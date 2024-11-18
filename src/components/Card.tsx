import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { TCard } from '../types'
import { Flex, FlexColumn, FlexRowAlignCenter } from './Flex'
import { Editor, useEditorInstance } from './Editor'
import { tc } from '../utils/themeColors'
import { useCardPopupStore } from './CardPopup'
import { Button } from './Button'
import { ArrowsOutSimple } from 'phosphor-react'
import type { Editor as TiptapEditor } from '@tiptap/react'
import { Label } from './Label'
import { updateCard } from '../stores/useCardStore'

export const Card = ({ card, disabled, sortableCheat }: { card: TCard; disabled?: boolean; sortableCheat: string }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: card.id,
        data: { card, sortableCheat },
        disabled,
    })

    const { editor } = useEditorInstance({
        content: card.content,
        shouldRerenderOnTransaction: true,
        onChange: ({ content }) => {
            updateCard({ sortableCheat, fields: { content } })
        },
    })
    const openPopup = useCardPopupStore((s) => s.openPopup)

    return (
        <FlexColumn
            ref={setNodeRef}
            style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
        >
            {/* CARD HEADER */}
            <FlexColumn
                onClick={() => openPopup({ card, sortableCheat })}
                style={{
                    borderRadius: '12px 12px 0 0',
                    padding: '1.6rem 1.2rem',
                    paddingBottom: '1.2rem',
                    backgroundColor: tc.bgPrimary,
                    gap: '0.4rem',
                    cursor: disabled ? 'grabbing' : 'default',
                }}
                {...attributes}
                {...listeners}
            >
                <Flex>
                    <h2 style={{ fontSize: '2rem', fontWeight: 700 }}>{card.title}</h2>
                    <Button radius="3rem" sx={{ marginLeft: 'auto' }}>
                        <ArrowsOutSimple size={18} />
                    </Button>
                </Flex>
                <p style={{ fontSize: '1.3rem', color: tc.textActiveSecondary, marginBottom: '0.3rem' }}>{card.desc}</p>
                {card.label && <Label label={card.label} />}
            </FlexColumn>

            {/* CARD CONTENT */}
            <FlexColumn
                style={{ padding: '0 0.8rem 1.6rem', backgroundColor: tc.bgPrimary, borderRadius: '0 0 12px 12px' }}
            >
                <Editor
                    editor={editor as TiptapEditor}
                    style={{
                        overflow: 'hidden auto',
                        backgroundColor: '#2C3034',
                        borderRadius: '0.8rem',
                        minHeight: '15.8rem',
                        maxHeight: '25rem',
                    }}
                />
            </FlexColumn>
        </FlexColumn>
    )
}
