import './htmlEditor.css'

import { Editor as TiptapEditor, EditorContent } from '@tiptap/react'
import { useEffect, useRef } from 'react'
import { LinkMenu } from './LinkMenu.tsx'
import { ImageMenu } from './ImageMenu.tsx'
import Box from '@mui/material/Box'

const useBubbleMenuScrollSync = (editor: TiptapEditor | null) => {
    useEffect(() => {
        if (!editor) return
        let raf = 0
        const onScroll = () => {
            if (raf) return
            raf = requestAnimationFrame(() => {
                raf = 0
                if (editor.isDestroyed) return
                if (!editor.isActive('link') && !editor.isActive('image')) return
                editor.view.dispatch(
                    editor.state.tr
                        .setMeta('textMenu', 'updatePosition')
                        .setMeta('imageMenu', 'updatePosition'),
                )
            })
        }
        document.addEventListener('scroll', onScroll, true)
        return () => {
            document.removeEventListener('scroll', onScroll, true)
            cancelAnimationFrame(raf)
        }
    }, [editor])
}

const hasAccent = ({ text }: { text: string }) => {
    const isAccent = /[À-ž]/.test(text)
    return isAccent
}

export const HTMLEditor = ({
    editor,
    style,
}: { editor: TiptapEditor | null; style: React.CSSProperties }) => {
    const ref = useRef<HTMLDivElement>(null)
    useBubbleMenuScrollSync(editor)

    if (!editor) return null

    const contentHasAccent = hasAccent({ text: editor.getText() })
    const fontFamily = contentHasAccent ? 'Poppins' : 'Rumiko Clear'

    return (
        <>
            <Box
                component={EditorContent}
                sx={{ '& .tiptap': { fontFamily } }}
                ref={ref}
                editor={editor}
                style={{
                    cursor: 'text',
                    fontSize: '1.3rem',
                    padding: '1.6rem 0.8rem',
                    wordBreak: 'break-word',
                    ...style,
                }}
                onClick={() => {
                    const currEditor = ref.current?.lastChild?.editor
                    if (!currEditor?.isFocused) {
                        editor?.chain().focus().run()
                    }
                }}
            />
            {editor && <LinkMenu editor={editor} />}
            {editor && <ImageMenu editor={editor} />}
        </>
    )
}
