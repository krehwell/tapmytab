import { useEffect, useRef } from 'react'
import { useKey } from 'react-use'
import { create } from 'zustand'
import Dialog from '@mui/material/Dialog'
import { FlexColumn, FlexRowAlignCenter } from './Flex/index.tsx'
import { tc } from '../utils/themeColors.ts'
import Box from '@mui/material/Box'
import { TCard } from '../types.ts'
import { Label } from './Label.tsx'
import { Editor, useEditorInstance } from './Editor/Editor.tsx'
import { Button } from './Button.tsx'
import { CardTitleInput } from './Card.tsx'
import { Toolbar } from './Editor/Toolbar/Toolbar.tsx'
import { Editor as TiptapEditor } from '@tiptap/react'
import { DotsThree, X } from '@phosphor-icons/react'
import { WithOptionsMenu } from './WithOptionsMenu.tsx'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { LABELS } from '../utils/label.ts'
import { deleteCard, updateCard } from '../stores/useCardStore.ts'
import { Due } from './Due.tsx'
import { emojify, hasEmoji } from '../utils/emojify.ts'

export const useCardPopupStore = create<{
    isOpen: boolean
    closePopup: () => void
    openPopup: (props: { card: TCard; sortableCheat: string }) => void
    sortableCheat: string | null
    card: TCard | null
    isDirty: boolean
    updateField: (props: { fields: Partial<TCard> }) => void
    editor: TiptapEditor | null
}>((set, get) => ({
    isOpen: false,
    sortableCheat: null,
    card: null,
    isDirty: false,
    editor: null,
    closePopup: () => set({ isOpen: false, card: null }),
    updateField: ({ fields }) => {
        const card = Object.assign({}, get().card)
        for (const key in fields) {
            card[key] = fields[key]
        }
        set({ card, isDirty: true })
    },
    openPopup: ({ card, sortableCheat }) => set({ isOpen: true, card, sortableCheat, isDirty: false }),
}))

const saveAndClose = () => {
    const { card, sortableCheat, closePopup } = useCardPopupStore.getState()
    if (card && sortableCheat) updateCard({ sortableCheat, fields: card })
    closePopup()
}

export const CardPopup = () => {
    const isOpen = useCardPopupStore((s) => s.isOpen)

    useKey(
        (e) => (e.metaKey || e.ctrlKey) && e.key === 'Enter',
        (e) => {
            if (!useCardPopupStore.getState().isOpen) return
            e.preventDefault()
            saveAndClose()
        },
    )

    return (
        <Dialog
            open={isOpen}
            transitionDuration={0}
            onClose={(_e, reason) => {
                // only let a backdrop click dismiss when there are no unsaved edits
                if (reason === 'backdropClick' && useCardPopupStore.getState().isDirty) return
                useCardPopupStore.getState().closePopup()
            }}
            PaperComponent={({ children, style, ...props }) => (
                <Box
                    component={FlexColumn}
                    style={{
                        backgroundColor: tc.surfaceBase,
                        borderRadius: '1.2rem',
                        padding: '1.6rem',
                        width: '62.4rem',
                        ...style,
                    }}
                    {...props}
                >
                    {children}
                </Box>
            )}
        >
            <CardPopupHeader />
            <CardPopupEditor key={String(isOpen)} />
            <div style={{ marginBottom: '2rem' }} />
            <CardPopupActions />
        </Dialog>
    )
}

const CardPopupHeader = () => {
    const card = useCardPopupStore((s) => s.card)
    const sortableCheat = useCardPopupStore((s) => s.sortableCheat)
    const closePopup = useCardPopupStore((s) => s.closePopup)
    const updateField = useCardPopupStore((s) => s.updateField)
    const titleRef = useRef<HTMLInputElement>(null)

    // focus title after MUI Dialog's focus trap settles
    useEffect(() => {
        const id = setTimeout(() => {
            const el = titleRef.current
            if (!el) return
            el.focus()
            el.setSelectionRange(el.value.length, el.value.length)
        }, 0)
        return () => clearTimeout(id)
    }, [])

    if (!card) return null

    return (
        <>
            <FlexRowAlignCenter style={{ marginBottom: '0.8rem' }}>
                <CardTitleInput
                    ref={titleRef}
                    value={card.title}
                    onChange={(e) => updateField({ fields: { title: e.target.value } })}
                    style={{ flex: 1, fontSize: '3.1rem', fontWeight: 'bold' }}
                />
                <WithOptionsMenu
                    options={[
                        {
                            label: 'Emojify',
                            hide: hasEmoji(card.title),
                            onClick: () => updateField({ fields: { title: emojify(card.title, 'end') } }),
                        },
                        {
                            label: 'Delete Card',
                            onClick: () => {
                                deleteCard({ sortableCheat: sortableCheat! })
                                closePopup()
                            },
                        },
                    ]}
                >
                    {({ openMenu }) => (
                        <Button radius='3.2rem' onClick={openMenu} tabIndex={-1}>
                            <DotsThree size={22} weight='bold' style={{ flexShrink: 0 }} />
                        </Button>
                    )}
                </WithOptionsMenu>
                <Button radius='3.2rem' onClick={closePopup} tabIndex={-1}>
                    <X size={22} />
                </Button>
            </FlexRowAlignCenter>
            <TextareaAutosize
                maxRows={2}
                maxLength={128}
                defaultValue={card?.desc}
                placeholder='Add description...'
                onChange={(e) => updateField({ fields: { desc: e.target.value } })}
                style={{
                    backgroundColor: 'transparent',
                    resize: 'none',
                    fontSize: '1.6rem',
                    color: tc.textSecondary,
                }}
            />
            <FlexRowAlignCenter>
                <CardPopupOptionsLabel card={card} />
                <Due
                    initialDueDate={card?.dueDate || null}
                    onChange={({ dueDate }) => {
                        updateField({ fields: { dueDate } })
                    }}
                />
            </FlexRowAlignCenter>
            <div style={{ marginBottom: '2rem' }} />
        </>
    )
}

const CardPopupOptionsLabel = ({ card }: { card: TCard }) => {
    const updateField = useCardPopupStore((s) => s.updateField)

    return (
        <WithOptionsMenu
            menuProps={{
                sx: {
                    '.MuiList-root': {
                        display: 'flex',
                        flexDirection: 'row',
                    },
                },
                anchorOrigin: { vertical: 'center', horizontal: 'right' },
                transformOrigin: { vertical: 'center', horizontal: 'left' },
            }}
            options={[...LABELS].map((l) => ({
                label: l,
                node: <Label label={l} style={{ cursor: 'pointer' }} />,
                onClick: () => updateField({ fields: { label: l } }),
            }))}
        >
            {({ openMenu }) => {
                return (
                    <Label
                        label={card.label}
                        style={{ marginTop: '0.8rem' }}
                        onClick={(e) => {
                            e.stopPropagation()
                            openMenu(e)
                        }}
                    />
                )
            }}
        </WithOptionsMenu>
    )
}

const CardPopupEditor = () => {
    const card = useCardPopupStore((s) => s.card)
    const updateField = useCardPopupStore((s) => s.updateField)

    const { editor } = useEditorInstance({
        content: card?.content || '',
        onChange: ({ content }) => updateField({ fields: { content } }),
        shouldRerenderOnTransaction: true,
    })

    if (!editor) return null

    return (
        <>
            <Editor
                editor={editor}
                style={{
                    overflow: 'hidden auto',
                    backgroundColor: tc.surfaceRaised,
                    borderRadius: '0.8rem 0.8rem 0rem 0rem',
                    minHeight: '21.2rem',
                    maxHeight: '55rem',
                }}
            />
            <Toolbar editor={editor} />
        </>
    )
}

const CardPopupActions = () => {
    const closePopup = useCardPopupStore((s) => s.closePopup)

    return (
        <FlexRowAlignCenter style={{ gap: '1.2rem', marginLeft: 'auto' }}>
            <Button
                onClick={closePopup}
                tabIndex={-1}
                style={{ width: '6.8rem', height: '3.3rem', borderRadius: '0.8rem' }}
            >
                Cancel
            </Button>
            <Button
                onClick={saveAndClose}
                sx={{
                    backgroundColor: tc.surfaceStrong,
                    width: '6.8rem',
                    height: '3.3rem',
                    borderRadius: '0.8rem',
                }}
            >
                Save
            </Button>
        </FlexRowAlignCenter>
    )
}
