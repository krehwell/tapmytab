import { useEditor } from '@tiptap/react'
import TextAlign from '@tiptap/extension-text-align'
import TaskItem from '@tiptap/extension-task-item'
import TaskList from '@tiptap/extension-task-list'
import debounce from 'lodash/debounce'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect } from 'react'
import { ImageExtension } from '../extensions/image.ts'
import { LinkExtension } from '../extensions/link.ts'
import { TrailingNode } from '../extensions/trailingNode.ts'

const extensions = [
    TaskList,
    TaskItem.configure({ nested: true }),
    TextAlign.configure({
        types: ['heading', 'paragraph'],
    }),
    StarterKit.configure({
        bulletList: { keepMarks: true, keepAttributes: false },
        orderedList: { keepMarks: true, keepAttributes: false },
    }),
    LinkExtension,
    ImageExtension,
    TrailingNode,
    Placeholder.configure({
        placeholder: ({ editor }) => {
            if (editor.isActive('heading')) {
                return ''
            }
            return `try type:

# title
**bold description text**

- list one
- list two
`
        },
    }),
]

const debouncedOnUpdate = debounce(
    ({ editor, onChange }) => onChange({ content: editor?.getHTML() }),
    100,
)

export const useHTMLEditorInstance = ({
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
        [],
    )

    useEffect(() => {
        if (!editor) return
        if (content !== editor.getHTML()) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    return { editor }
}
