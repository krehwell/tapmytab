import { create } from 'zustand'
import Dialog from '@mui/material/Dialog'
import { Flex, FlexColumn, FlexRowAlignCenter } from './Flex'
import { tc } from '../utils/themeColors'
import Box from '@mui/material/Box'
import { TCard } from '../types'
import { Label } from './Card'
import { Editor } from './Editor'
import { Button } from './Button'
import { Toolbar } from './Editor/Toolbar'
import { Editor as TiptapEditor } from '@tiptap/react'
import { DotsThree, DotsThreeCircle, X } from 'phosphor-react'
import { WithOptionsMenu } from './WithOptionsMenu'

export const useCardPopupStore = create<{
    isOpen: boolean
    closePopup: () => void
    openPopup: ({ card, editor }: { card: TCard; editor: TiptapEditor }) => void
    card: TCard | null
    editor: TiptapEditor | null
}>((set) => ({
    isOpen: false,
    closePopup: () => set({ isOpen: false }),
    openPopup: ({ card, editor }) => set({ isOpen: true, card, editor }),
    card: null,
    editor: null,
}))

const CardPopupHeader = () => {
    const card = useCardPopupStore((s) => s.card)
    const closePopup = useCardPopupStore((s) => s.closePopup)
    return (
        <>
            <FlexRowAlignCenter style={{ marginBottom: '0.8rem' }}>
                <h2 style={{ fontSize: '3.1rem', fontWeight: 'bold', marginRight: 'auto' }}>{card?.title}</h2>
                <WithOptionsMenu options={[{ label: 'Delete Card', onClick: () => alert('TODO: Delete card') }]}>
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
            <p style={{ fontSize: '1.6rem', color: 'rgba(248, 249, 250, 0.80)' }}>{card?.desc}</p>
            <Label label={card?.label} style={{ marginTop: '0.8rem' }} />
            <div style={{ marginBottom: '2rem' }} />
        </>
    )
}

export const CardPopup = () => {
    const isOpen = useCardPopupStore((s) => s.isOpen)
    const closePopup = useCardPopupStore((s) => s.closePopup)
    const editor = useCardPopupStore((s) => s.editor)

    return (
        <Dialog
            open={isOpen}
            onClose={(_e, reason) => {
                if (reason === 'backdropClick') return
                closePopup()
            }}
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

            {editor && (
                <Editor
                    editor={editor}
                    style={{
                        overflow: 'hidden auto',
                        backgroundColor: '#2C3034',
                        borderRadius: '0.8rem 0.8rem 0rem 0rem',
                        minHeight: '21.2rem',
                        maxHeight: '30rem',
                        fontSize: '1.3rem',
                        padding: '1.6rem 0.8rem',
                    }}
                />
            )}
            {editor && <Toolbar editor={editor} />}
            <div style={{ marginBottom: '2rem' }} />

            <FlexRowAlignCenter style={{ gap: '1.2rem', marginLeft: 'auto' }}>
                <Button onClick={closePopup} style={{ width: '6.8rem', height: '3.3rem', borderRadius: '0.8rem' }}>
                    Cancel
                </Button>
                <Button
                    onClick={() => alert('TODO: save')}
                    sx={{ backgroundColor: '#4C5257', width: '6.8rem', height: '3.3rem', borderRadius: '0.8rem' }}
                >
                    Save
                </Button>
            </FlexRowAlignCenter>
        </Dialog>
    )
}
