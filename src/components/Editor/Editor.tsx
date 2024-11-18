import './editor.css'

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import Link from '@tiptap/extension-link'
import TextStyle from '@tiptap/extension-text-style'
import { Editor as TiptapEditor, EditorContent, useEditor } from '@tiptap/react'
import TextAlign from '@tiptap/extension-text-align'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import debounce from 'lodash/debounce'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useRef } from 'react'
import LinkMenu from './LinkMenu'

const extensions = [
    Color.configure({ types: [TextStyle.name, ListItem.name] }),
    TextStyle.configure({ types: [ListItem.name] }),
    TaskList,
    TaskItem.configure({ nested: true }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
    }),
    Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: 'https',
    }),
]

const debouncedOnUpdate = debounce(({ editor, onChange }) => onChange({ content: editor?.getHTML() }), 500)

export const useEditorInstance = ({
    content,
    onChange,
    shouldRerenderOnTransaction,
}: {
    content: string
    onChange?: (props: { content: string }) => void
    shouldRerenderOnTransaction?: boolean
}) => {
    const editor = useEditor(
        {
            editable: true,
            extensions,
            content,
            shouldRerenderOnTransaction,
            onUpdate: ({ editor }) => debouncedOnUpdate({ editor, onChange }),
        },
        []
    )

    useEffect(() => {
        if (!editor) return
        if (content !== editor.getHTML()) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    return { editor }
}

export const Editor = ({ editor, style }: { editor: TiptapEditor; style: React.CSSProperties }) => {
    const ref = useRef<HTMLDivElement>(null)

    return (
        <>
            <EditorContent
                ref={ref}
                editor={editor}
                style={{ cursor: 'text', fontSize: '1.3rem', lineHeight: '1', padding: '1.6rem 0.8rem', ...style }}
                placeholder="Start typing..."
                onClick={() => {
                    const currEditor = ref.current?.lastChild?.editor
                    if (!currEditor?.isFocused) {
                        editor?.chain().focus().run()
                    }
                }}
            />
            {editor && <LinkMenu editor={editor} />}
        </>
    )
}
