import { forwardRef, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { isExcalidrawCard, TCard, TExcalidraw, TLabel } from '../types.ts'
import { Flex, FlexColumn, FlexColumnJustifyCenter, FlexRowAlignCenter } from './Flex/index.tsx'
import { HTMLEditor, useHTMLEditorInstance } from './HTMLEditor/index.ts'
import { tc } from '../utils/themeColors.ts'
import { useCardPopupStore } from './CardPopup.tsx'
import { Button } from './Button.tsx'
import { ArrowsOutSimple, Smiley } from '@phosphor-icons/react'
import { emojify, hasEmoji } from '../utils/emojify.ts'
import { Label } from './Label.tsx'
import { updateCard } from '../stores/useCardStore.ts'
import { Due } from './Due.tsx'
import { useDrawingPreview } from './DrawingEditor/index.ts'

export const CardTitleInput = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
    ({ style, onKeyDown, ...props }, ref) => {
        const placeholder = 'Add Title...'
        const size = String(props?.value || placeholder).length / 1.1
        return (
            <input
                ref={ref}
                placeholder={placeholder}
                maxLength={60}
                size={Math.ceil(size)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') e.currentTarget.blur()
                    onKeyDown?.(e)
                }}
                style={{
                    minWidth: 0,
                    maxWidth: '100%',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none',
                    textOverflow: 'ellipsis',
                    ...style,
                }}
                {...props}
            />
        )
    },
)

export const Card = ({
    card,
    disabled,
    sortableCheat,
}: {
    card: TCard
    disabled?: boolean
    sortableCheat: string
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transition,
        transform,
        isDragging,
    } = useSortable({
        id: card.id,
        data: { card, sortableCheat },
        disabled,
        // don't animate the layout shift when a card is inserted into a new board
        // the intermediate state is what renders as a weird gap (notably on Firefox)
        animateLayoutChanges: () => false,
    })

    const openPopup = useCardPopupStore((s) => s.openPopup)

    return (
        <FlexColumn
            ref={setNodeRef}
            data-testid='card'
            id={card.id}
            data-card-title={card.title}
            style={{
                transform: CSS.Transform.toString(transform),
                transition,
                opacity: isDragging ? 0.4 : 1,
            }}
        >
            {/* CARD HEADER */}
            <FlexColumn
                data-testid='card-header'
                onClick={() => openPopup({ card, sortableCheat })}
                style={{
                    borderRadius: isDragging || disabled ? '12px 12px 12px 12px' : '12px 12px 0 0',
                    padding: '1.6rem 1.2rem',
                    paddingBottom: '1.2rem',
                    backgroundColor: tc.surfaceBase,
                    gap: '0.4rem',
                    cursor: disabled ? 'grabbing' : 'default',
                }}
                {...attributes}
                {...listeners}
            >
                <Flex>
                    <CardTitleInput
                        value={card.title}
                        onChange={(e) => updateCard({ sortableCheat, fields: { title: e.target.value } })}
                        onClick={(e) => e.stopPropagation()}
                        onPointerDown={(e) => e.stopPropagation()}
                        style={{ fontSize: '2rem', fontWeight: 700 }}
                    />
                    {hasEmoji(card.title)
                        ? (
                            <Button radius='3rem' title='Expand' sx={{ marginLeft: 'auto' }}>
                                <ArrowsOutSimple size={18} />
                            </Button>
                        )
                        : (
                            <Button
                                radius='3rem'
                                title='Emojify title'
                                sx={{ marginLeft: 'auto' }}
                                onClick={(e) => {
                                    e.stopPropagation()
                                    updateCard({ sortableCheat, fields: { title: emojify(card.title, 'end') } })
                                }}
                            >
                                <Smiley size={18} />
                            </Button>
                        )}
                </Flex>
                <p style={{ fontSize: '1.3rem', color: tc.textSecondary, marginBottom: '0.3rem' }}>
                    {card.desc}
                </p>
                <FlexRowAlignCenter>
                    {card.label && card.label !== TLabel.No && <Label label={card.label} />}
                    {card?.dueDate && <Due initialDueDate={card.dueDate} key={card.dueDate} />}
                </FlexRowAlignCenter>
            </FlexColumn>

            {!(isDragging || disabled) && (
                <FlexColumn
                    onClick={isExcalidrawCard(card) ? () => openPopup({ card, sortableCheat }) : undefined}
                    style={{
                        padding: '0 0.8rem 1.6rem',
                        backgroundColor: tc.surfaceBase,
                        borderRadius: '0 0 12px 12px',
                        cursor: isExcalidrawCard(card) ? 'pointer' : undefined,
                    }}
                >
                    {isExcalidrawCard(card)
                        ? <CardDrawingEditor content={card.content} />
                        : <CardHTMLEditor content={card.content as string} sortableCheat={sortableCheat} />}
                </FlexColumn>
            )}
        </FlexColumn>
    )
}

const CardDrawingEditor = ({ content }: { content: TExcalidraw }) => {
    const ref = useDrawingPreview(content)

    return (
        <FlexColumnJustifyCenter
            ref={ref}
            style={{
                width: '100%',
                height: '15.8rem',
                overflow: 'hidden',
                borderRadius: '0.8rem',
                backgroundColor: '#161718',
                cursor: 'default',
                alignItems: 'center',
                fontSize: '1.2rem',
                padding: '0.2rem',
            }}
            // deno-lint-ignore jsx-no-children-prop
            children={!content.elements.length ? 'click to draw' : undefined}
        />
    )
}

const editorStyle: React.CSSProperties = {
    overflow: 'hidden auto',
    backgroundColor: tc.surfaceRaised,
    borderRadius: '0.8rem',
    minHeight: '15.8rem',
    maxHeight: '40rem',
}

const CardHTMLEditor = ({ content, sortableCheat }: { content: string; sortableCheat: string }) => {
    const [isActive, setIsActive] = useState(false)

    // for performance wise, we display static view until user hover it haha.  like why not
    if (!isActive) {
        return <CardHTMLPreview content={content} onMouseEnter={() => setIsActive(true)} />
    }
    return <CardHTMLEditorLive content={content} sortableCheat={sortableCheat} />
}

// mounting tiptap is expensive, this way we would boost the perf
const CardHTMLPreview = ({ content, onMouseEnter }: { content: string; onMouseEnter?: () => void }) => {
    const hasAccent = /[À-ž]/.test(content)
    return (
        <div
            onMouseEnter={onMouseEnter}
            style={{
                ...editorStyle,
                cursor: 'text',
                fontSize: '1.3rem',
                padding: '1.6rem 0.8rem',
                wordBreak: 'break-word',
            }}
        >
            <div
                className='tiptap ProseMirror'
                style={{ fontFamily: hasAccent ? 'Poppins' : 'Rumiko Clear' }}
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    )
}

const CardHTMLEditorLive = ({ content, sortableCheat }: { content: string; sortableCheat: string }) => {
    const { editor } = useHTMLEditorInstance({
        content,
        shouldRerenderOnTransaction: true,
        onChange: ({ content }) => updateCard({ sortableCheat, fields: { content } }),
    })

    if (!editor) return <CardHTMLPreview content={content} />
    return <HTMLEditor editor={editor} style={editorStyle} />
}
