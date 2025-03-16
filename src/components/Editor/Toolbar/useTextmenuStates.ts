import { Editor as TiptapEditor, useEditorState } from '@tiptap/react'

export const useTextmenuStates = (editor: TiptapEditor) => {
    const states = useEditorState({
        editor,
        selector: (ctx) => {
            return {
                isParagraph: ctx.editor.isActive('paragraph') &&
                    !ctx.editor.isActive('orderedList') &&
                    !ctx.editor.isActive('bulletList') &&
                    !ctx.editor.isActive('taskList'),
                isBold: ctx.editor.isActive('bold'),
                isItalic: ctx.editor.isActive('italic'),
                isCode: ctx.editor.isActive('code'),
                isCodeBlock: ctx.editor.isActive('codeBlock'),
                isAlignLeft: ctx.editor.isActive({ textAlign: 'left' }),
                isAlignCenter: ctx.editor.isActive({ textAlign: 'center' }),
                isAlignRight: ctx.editor.isActive({ textAlign: 'right' }),
                isAlignJustify: ctx.editor.isActive({ textAlign: 'justify' }),
                isOrderedList: ctx.editor.isActive('orderedList'),
                isBulletList: ctx.editor.isActive('bulletList'),
                isTaskList: ctx.editor.isActive('taskList'),
                isH1: ctx.editor.isActive('heading', { level: 1 }),
                isH2: ctx.editor.isActive('heading', { level: 2 }),
                isH3: ctx.editor.isActive('heading', { level: 3 }),
                isH4: ctx.editor.isActive('heading', { level: 4 }),
            }
        },
    })

    return states
}
