import { create } from 'zustand'
import Dialog from '@mui/material/Dialog'
import { FlexColumn, FlexRowAlignCenter } from './Flex'
import { tc } from '../utils/themeColors'
import Box from '@mui/material/Box'
import { TCard } from '../types'
import { Label } from './Card'
import { Editor, useEditorStore } from './Editor'
import { Button } from './Button'
import { ArrowUUpLeft, ArrowUUpRight, Code, Link, List, TextBolder, TextItalic } from 'phosphor-react'
import { Editor as EditorType } from '@tiptap/react'

export const useCardPopupStore = create<{
    isOpen: boolean
    closePopup: () => void
    openPopup: ({ card }: { card: TCard }) => void
    card: TCard | null
}>((set) => ({
    isOpen: false,
    closePopup: () => set({ isOpen: false }),
    openPopup: ({ card }) => set({ isOpen: true, card }),
    card: null,
}))

const ToolbarBtn = ({ Icon }: { Icon: React.ElementType }) => {
    return (
        <Button radius="2.8rem">
            <Icon size={16} />
        </Button>
    )
}

const Toolbar = () => {
    const editor = useEditorStore((s) => s.editor)
    console.log(editor)

    return (
        <FlexRowAlignCenter
            style={{
                backgroundColor: '#24272A',
                borderRadius: '0rem 0rem 0.8rem 0.8rem',
                gap: '0.8rem',
                padding: '0.4rem 0.8rem',
                height: '3.6rem',
            }}
        >
            <ToolbarBtn Icon={ArrowUUpLeft} />
            <ToolbarBtn Icon={ArrowUUpRight} />
            <ToolbarBtn Icon={List} />
            <ToolbarBtn Icon={TextBolder} />
            <ToolbarBtn Icon={TextItalic} />
            <ToolbarBtn Icon={Code} />
            <ToolbarBtn Icon={Link} />
        </FlexRowAlignCenter>
    )
}

export const CardPopup = () => {
    const isOpen = useCardPopupStore((s) => s.isOpen)
    const closePopup = useCardPopupStore((s) => s.closePopup)
    const card = useCardPopupStore((s) => s.card)

    return (
        <Dialog
            open={isOpen}
            onClose={(e, reason) => {
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
            <h2 style={{ fontSize: '3.1rem', fontWeight: 'bold', marginBottom: '0.8rem' }}>{card?.title}</h2>
            <p style={{ fontSize: '1.6rem', color: 'rgba(248, 249, 250, 0.80)' }}>{card?.desc}</p>
            <Label label={card?.label} style={{ marginTop: '0.8rem' }} />
            <div style={{ marginBottom: '2rem' }} />

            <Editor
                content={card?.content || ''}
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
            <Toolbar />
            <div style={{ marginBottom: '2rem' }} />

            <FlexRowAlignCenter style={{ gap: '1.2rem', marginLeft: 'auto' }}>
                <Button onClick={closePopup} style={{ width: '6.8rem', height: '3.3rem', borderRadius: '0.8rem' }}>
                    Cancel
                </Button>
                <Button sx={{ backgroundColor: '#4C5257', width: '6.8rem', height: '3.3rem', borderRadius: '0.8rem' }}>
                    Save
                </Button>
            </FlexRowAlignCenter>
        </Dialog>
    )
}
