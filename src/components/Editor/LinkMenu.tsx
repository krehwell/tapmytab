import { BubbleMenu as BaseBubbleMenu, Editor as TiptapEditor } from '@tiptap/react'
import { ArrowUpRight, KeyReturn, Pencil, Trash, XCircle } from 'phosphor-react'
import { useCallback, useState } from 'react'
import { tc } from '../../utils/themeColors'
import { Button } from '../Button'
import { FlexRowAlignCenter } from '../Flex'

export const LinkMenu = ({ editor }: { editor: TiptapEditor }) => {
    const [isEditLink, setIsEditLink] = useState(false)

    const shouldShow = useCallback(() => {
        const isActive = editor.isActive('link')
        return isActive
    }, [editor])

    const { href: link } = editor.getAttributes('link')

    const onSetLink = useCallback(
        (url: string) => {
            editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
            setIsEditLink(false)
        },
        [editor]
    )

    const onUnsetLink = useCallback(() => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
    }, [editor])

    const renderPreviewLink = () => {
        return (
            <>
                <a href={link} target="_blank" style={{ marginRight: '0.3rem' }}>
                    {link}
                </a>
                <Button radius="2.5rem" title="Open" onClick={() => window.open(link, '_blank')}>
                    <ArrowUpRight size={13} style={{ flexShrink: 0 }} weight="bold" />
                </Button>
                <Button radius="2.5rem" title="Edit Link" onClick={() => setIsEditLink(true)}>
                    <Pencil size={13} style={{ flexShrink: 0 }} />
                </Button>
            </>
        )
    }

    const renderEditLink = () => {
        return (
            <>
                <input
                    type="text"
                    defaultValue={link}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            onSetLink(e.currentTarget.value)
                        }
                    }}
                    style={{ width: '25rem', marginRight: '0.3rem' }}
                />
                <Button radius="2.5rem" title="Confirm Modify" onClick={() => onSetLink('https://google.com')}>
                    <KeyReturn size={15} style={{ flexShrink: 0 }} />
                </Button>
                <Button radius="2.5rem" title={'Remove Link'} onClick={() => onUnsetLink()}>
                    <Trash size={15} style={{ flexShrink: 0 }} />
                </Button>
                <Button radius="2.5rem" title="Cancel Edit" onClick={() => setIsEditLink(false)}>
                    <XCircle size={15} style={{ flexShrink: 0 }} />
                </Button>
            </>
        )
    }

    return (
        <BaseBubbleMenu
            editor={editor}
            pluginKey="textMenu"
            shouldShow={shouldShow}
            updateDelay={0}
            tippyOptions={{
                offset: [0, 1],
                popperOptions: {
                    modifiers: [{ name: 'flip', enabled: false }],
                },
                onHide: () => {
                    setIsEditLink(false)
                },
            }}
        >
            <FlexRowAlignCenter
                style={{
                    backgroundColor: tc.tokenGrey,
                    fontSize: '1.3rem',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '0.4rem',
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                }}
            >
                {isEditLink ? renderEditLink() : renderPreviewLink()}
            </FlexRowAlignCenter>
        </BaseBubbleMenu>
    )
}

export default LinkMenu
