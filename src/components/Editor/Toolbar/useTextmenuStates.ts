import { Editor as TiptapEditor } from '@tiptap/react'

export const useTextmenuStates = (editor: TiptapEditor) => {
    return {
        isBold: editor.isActive('bold'),
        isItalic: editor.isActive('italic'),
        isCode: editor.isActive('code'),
        isCodeBlock: editor.isActive('codeBlock'),
        isAlignLeft: editor.isActive({ textAlign: 'left' }),
        isAlignCenter: editor.isActive({ textAlign: 'center' }),
        isAlignRight: editor.isActive({ textAlign: 'right' }),
        isAlignJustify: editor.isActive({ textAlign: 'justify' }),
        isOrderedList: editor.isActive('orderedList'),
        isBulletList: editor.isActive('bulletList'),
        isTaskList: editor.isActive('taskList'),
    }
}
