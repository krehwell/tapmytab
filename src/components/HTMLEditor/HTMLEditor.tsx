import './htmlEditor.css'

import { Editor as TiptapEditor, EditorContent } from '@tiptap/react'
import { useRef } from 'react'
import { LinkMenu } from './LinkMenu.tsx'
import { ImageMenu } from './ImageMenu.tsx'
import Box from '@mui/material/Box'

const hasAccent = ({ text }: { text: string }) => {
    const isAccent = /[À-ž]/.test(text)
    return isAccent
}

export const HTMLEditor = ({
    editor,
    style,
}: { editor: TiptapEditor | null; style: React.CSSProperties }) => {
    const ref = useRef<HTMLDivElement>(null)

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
