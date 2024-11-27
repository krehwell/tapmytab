import { useCallback, useState } from 'react'
import { BubbleMenu as BaseBubbleMenu, Editor as TiptapEditor } from '@tiptap/react'
import { ArrowUpRight, KeyReturn, Pencil, Trash, XCircle } from '@phosphor-icons/react'
import { tc } from '../../utils/themeColors.ts'
import { Button } from '../Button.tsx'
import { FlexColumn, FlexRowAlignCenter } from '../Flex/index.tsx'

export const LinkMenu = ({ editor }: { editor: TiptapEditor }) => {
    const [url, setUrl] = useState('')
    const [text, setText] = useState('')
    const [isEditLink, setIsEditLink] = useState(false)

    const shouldShow = useCallback(() => {
        const isActive = editor.isActive('link')
        if (isActive) {
            const { href: link } = editor.getAttributes('link')
            setUrl(link)

            const { from } = editor.view.state.selection
            const linkNode = editor.state.doc.nodeAt(from - 1)
            setText(linkNode?.text || '')
        }
        return isActive
    }, [editor])

    const onSetLink = useCallback(
        ({ url, text }: { url: string; text: string }) => {
            editor
                .chain()
                .focus()
                .extendMarkRange('link')
                .setLink({ href: url })
                .command(({ tr }) => {
                    tr.insertText(text)
                    return true
                })
                .run()
            setIsEditLink(false)
        },
        [editor],
    )

    const onUnsetLink = useCallback(() => {
        editor.chain().focus().extendMarkRange('link').unsetLink().run()
    }, [editor])

    const renderPreviewLink = () => {
        return (
            <>
                <a href={url} target='_blank' style={{ marginRight: '0.3rem' }}>
                    {url}
                </a>
                <Button
                    radius='2.5rem'
                    title='Open'
                    onClick={() => {
                        let urlParsed = url.includes('http') ? url : 'https://' + url
                        window.open(urlParsed, '_blank')
                    }}
                >
                    <ArrowUpRight size={13} style={{ flexShrink: 0 }} weight='bold' />
                </Button>
                <Button
                    radius='2.5rem'
                    title='Edit Link'
                    onClick={() => setIsEditLink(true)}
                >
                    <Pencil size={13} style={{ flexShrink: 0 }} />
                </Button>
            </>
        )
    }

    const renderEditLink = () => {
        return (
            <>
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
                    <FlexRowAlignCenter
                        style={{ margin: '0.3rem auto 0', gap: '0.8rem' }}
                    >
                        <Button
                            radius='2rem'
                            title='Cancel Edit'
                            onClick={() => setIsEditLink(false)}
                        >
                            <XCircle size={16} style={{ flexShrink: 0 }} />
                        </Button>
                        <Button
                            radius='2rem'
                            title={'Remove Link'}
                            onClick={() => onUnsetLink()}
                        >
                            <Trash size={16} style={{ flexShrink: 0 }} />
                        </Button>
                        <Button
                            radius='2rem'
                            title='Confirm Modify'
                            onClick={() => onSetLink({ url, text })}
                        >
                            <KeyReturn size={16} style={{ flexShrink: 0 }} />
                        </Button>
                    </FlexRowAlignCenter>
                </FlexColumn>
            </>
        )
    }

    return (
        <BaseBubbleMenu
            editor={editor}
            pluginKey='textMenu'
            shouldShow={shouldShow}
            updateDelay={0}
            tippyOptions={{
                offset: [0, 1],
                popperOptions: {
                    modifiers: [{ name: 'flip', enabled: false }],
                },
                onHidden: () => {
                    setIsEditLink(false)
                    setText('')
                    setUrl('')
                },
            }}
        >
            <FlexRowAlignCenter
                style={{
                    display: !!url ? 'flex' : 'none',
                    backgroundColor: tc.tokenGrey,
                    fontSize: '1.3rem',
                    padding: '0.5rem 0.8rem',
                    borderRadius: '0.4rem',
                    boxShadow: 'rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px',
                    width: 'fit-content',
                }}
            >
                {isEditLink ? renderEditLink() : renderPreviewLink()}
            </FlexRowAlignCenter>
        </BaseBubbleMenu>
    )
}

export const UrlInput = ({
    onConfirm,
    ...inputProps
}: { onConfirm: () => void } & React.InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <input
            type='text'
            placeholder='url'
            onKeyDown={(e) => {
                if (e.key === 'Enter') onConfirm()
            }}
            style={{ width: '25rem' }}
            {...inputProps}
        />
    )
}

export const UrlTextInput = ({
    onConfirm,
    ...inputProps
}: { onConfirm: () => void } & React.InputHTMLAttributes<HTMLInputElement>) => {
    return (
        <input
            type='text'
            placeholder='link text'
            onKeyDown={(e) => {
                if (e.key === 'Enter') onConfirm()
            }}
            style={{ width: '25rem' }}
            {...inputProps}
        />
    )
}
