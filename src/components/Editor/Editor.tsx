import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import { Editor as TiptapEditor, EditorContent, useEditor } from '@tiptap/react'
import TextAlign from '@tiptap/extension-text-align'

import StarterKit from '@tiptap/starter-kit'
import './editor.css'
import { useRef } from 'react'

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
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

export const useEditorInstance = ({ content }: { content: string }) => {
    const editor = useEditor({ editable: true, extensions, content, shouldRerenderOnTransaction: true }, [])
    return { editor }
}

export const Editor = ({ editor, style }: { editor: TiptapEditor; style: React.CSSProperties }) => {
    const ref = useRef<HTMLDivElement>(null)

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
