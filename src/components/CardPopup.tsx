import { create } from 'zustand'
import Dialog from '@mui/material/Dialog'
import { FlexColumn, FlexRowAlignCenter } from './Flex'
import { tc } from '../utils/themeColors'
import Box from '@mui/material/Box'
import { TCard } from '../types'
import { Label } from './Label'
import { Editor, useEditorInstance } from './Editor'
import { Button } from './Button'
import { Toolbar } from './Editor/Toolbar'
import { Editor as TiptapEditor } from '@tiptap/react'
import { DotsThree, X } from 'phosphor-react'
import { WithOptionsMenu } from './WithOptionsMenu'
import TextareaAutosize from '@mui/material/TextareaAutosize'
import { cycleNextLabel } from '../utils/label'
import { deleteCard, updateCard } from '../stores/useCardStore'

export const useCardPopupStore = create<{
    isOpen: boolean
    closePopup: () => void
    openPopup: (props: { card: TCard; sortableCheat: string }) => void
    sortableCheat: string | null
    card: TCard | null
    updateField: (props: { fields: Partial<TCard> }) => void
    editor: TiptapEditor | null
}>((set, get) => ({
    isOpen: false,
    sortableCheat: null,
    card: null,
    editor: null,
    closePopup: () => set({ isOpen: false, card: null }),
    updateField: ({ fields }) => {
        const card = Object.assign({}, get().card)
        for (const key in fields) {
            card[key] = fields[key]
        }
        set({ card })
    },
    openPopup: ({ card, sortableCheat }) => set({ isOpen: true, card, sortableCheat }),
}))

const CardPopupHeader = () => {
    const card = useCardPopupStore((s) => s.card)
    const sortableCheat = useCardPopupStore((s) => s.sortableCheat)
    const closePopup = useCardPopupStore((s) => s.closePopup)
    const updateField = useCardPopupStore((s) => s.updateField)

    return (
        <>
            <FlexRowAlignCenter style={{ marginBottom: '0.8rem' }}>
                <TextareaAutosize
                    maxRows={1}
                    maxLength={60}
                    defaultValue={card?.title}
                    placeholder={'Add Title...'}
                    onChange={(e) => updateField({ fields: { title: e.target.value } })}
                    style={{
                        backgroundColor: 'transparent',
                        flex: 1,
                        resize: 'none',
                        fontSize: '3.1rem',
                        fontWeight: 'bold',
                    }}
                />
                <WithOptionsMenu
                    options={[
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
                        <Button radius="3.2rem" onClick={openMenu}>
                            <DotsThree size={22} weight="bold" />
                        </Button>
                    )}
                </WithOptionsMenu>
                <Button radius="3.2rem" onClick={closePopup}>
                    <X size={22} />
                </Button>
            </FlexRowAlignCenter>
            <TextareaAutosize
                maxRows={1}
                maxLength={60}
                defaultValue={card?.desc}
                placeholder={'Add description...'}
                onChange={(e) => updateField({ fields: { desc: e.target.value } })}
                style={{
                    backgroundColor: 'transparent',
                    resize: 'none',
                    fontSize: '1.6rem',
                    color: 'rgba(248, 249, 250, 0.80)',
                }}
            />
            <Label
                label={card?.label}
                style={{ marginTop: '0.8rem' }}
                onClick={(e) => {
                    e.stopPropagation()
                    updateField({ fields: { label: cycleNextLabel({ label: card?.label }) } })
                }}
            />
            <div style={{ marginBottom: '2rem' }} />
        </>
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
                    backgroundColor: '#2C3034',
                    borderRadius: '0.8rem 0.8rem 0rem 0rem',
                    minHeight: '21.2rem',
                    maxHeight: '30rem',
                }}
            />
            <Toolbar editor={editor} />
        </>
    )
}

const CardPopupActions = () => {
    const sortableCheat = useCardPopupStore((s) => s.sortableCheat)
    const card = useCardPopupStore((s) => s.card)
    const closePopup = useCardPopupStore((s) => s.closePopup)

    return (
        <FlexRowAlignCenter style={{ gap: '1.2rem', marginLeft: 'auto' }}>
            <Button onClick={closePopup} style={{ width: '6.8rem', height: '3.3rem', borderRadius: '0.8rem' }}>
                Cancel
            </Button>
            <Button
                onClick={() => {
                    updateCard({ sortableCheat: sortableCheat!, fields: card! })
                    closePopup()
                }}
                sx={{ backgroundColor: '#4C5257', width: '6.8rem', height: '3.3rem', borderRadius: '0.8rem' }}
            >
                Save
            </Button>
        </FlexRowAlignCenter>
    )
}

export const CardPopup = () => {
    const isOpen = useCardPopupStore((s) => s.isOpen)

    return (
        <Dialog
            open={isOpen}
            transitionDuration={0}
            PaperComponent={({ children, style, ...props }) => (
                <Box
                    component={FlexColumn}
                    style={{
                        backgroundColor: tc.bgPrimary,
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
