import ClickAwayListener from '@mui/material/ClickAwayListener'
import { Button } from '../../Button'
import { Editor as TiptapEditor } from '@tiptap/react'
import { Link, KeyReturn } from 'phosphor-react'
import { useCallback, useState } from 'react'
import { tc } from '../../../utils/themeColors'
import { FlexRowAlignCenter, FlexColumn } from '../../Flex'
import { UrlTextInput, UrlInput } from '../LinkMenu'
import { ToolbarBtn } from './ToolbarBtn'

export const ToolbarLinkOption = ({ editor }: { editor: TiptapEditor }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [text, setText] = useState('')
    const [url, setUrl] = useState('')

    const onSetLink = useCallback(
        ({ url, text }: { url: string; text: string }) => {
            if (!url.trim() || !text.trim()) return

            editor
                .chain()
                .focus()
                .insertContent({ type: 'text', text: text, marks: [{ type: 'link', attrs: { href: url } }] })
                .run()
        },
        [editor]
    )

    return (
        <div style={{ position: 'relative' }}>
            <ToolbarBtn
                title="Link"
                Icon={Link}
                onClick={() => {
                    setIsMenuOpen(true)
                }}
            />

            {isMenuOpen && (
                <ClickAwayListener onClickAway={() => setIsMenuOpen(false)}>
                    <FlexRowAlignCenter
                        style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            width: 'fit-content',
                            transform: 'translateX(-50%)',
                            backgroundColor: tc.tokenGrey,
                            padding: '0.5rem 0.8rem',
                            borderRadius: '0.4rem',
                            boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                            gap: '0.3rem',
                        }}
                    >
                        <FlexColumn>
                            <UrlTextInput
                                value={text}
                                onConfirm={() => onSetLink({ text, url })}
                                onChange={(e) => setText(e.target.value)}
                            />
                            <UrlInput
                                value={url}
                                onConfirm={() => onSetLink({ text, url })}
                                onChange={(e) => setUrl(e.target.value)}
                            />
                        </FlexColumn>
                        <Button radius="2.5rem" title="Confirm Modify" onClick={() => onSetLink({ url, text })}>
                            <KeyReturn size={16} style={{ flexShrink: 0 }} />
                        </Button>
                    </FlexRowAlignCenter>
                </ClickAwayListener>
            )}
        </div>
    )
}
