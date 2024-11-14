import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import './editor.css'
import { useRef } from 'react'

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
    }),
    Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: 'https',
    }),
]

export const Editor = ({ content, style }: { content: string; style: React.CSSProperties }) => {
    const ref = useRef<HTMLDivElement>(null)

    const editor = useEditor({
        editable: true,
        extensions,
        content,
    })

    return (
        <EditorContent
            ref={ref}
            editor={editor}
            style={{ cursor: 'text', ...style }}
            placeholder="Start typing..."
            onClick={() => {
                const currEditor = ref.current?.lastChild?.editor
                if (!currEditor?.isFocused) {
                    editor?.chain().focus().run()
                }
            }}
        />
    )
}
