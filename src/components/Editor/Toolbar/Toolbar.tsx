import { FlexRowAlignCenter } from '../../Flex'
import { ArrowUUpLeft, ArrowUUpRight, BracketsCurly, Code, TextBolder, TextItalic } from 'phosphor-react'
import { Editor as TiptapEditor } from '@tiptap/react'
import { useTextmenuStates } from './useTextmenuStates'
import { ToolbarBtn } from './ToolbarBtn'
import { ToolbarLinkOption } from './ToolbarLinkOption'
import { ToolbarListOptions } from './ToolbarListOptions'
import { ToolbarTextAlignOptions } from './ToolbarTextAlignOptions'

export const Toolbar = ({ editor }: { editor: TiptapEditor }) => {
    const { isBold, isItalic, isCode, isCodeBlock } = useTextmenuStates(editor)

    return (
        <FlexRowAlignCenter
            style={{
                backgroundColor: '#24272A',
                borderRadius: '0rem 0rem 0.8rem 0.8rem',
                gap: '0.8rem',
                padding: '0.4rem 0.8rem',
                height: '3.6rem',
            }}
        >
            <ToolbarBtn title="Undo" Icon={ArrowUUpLeft} onClick={() => editor.chain().undo().run()} />
            <ToolbarBtn title="Redo" Icon={ArrowUUpRight} onClick={() => editor.chain().redo().run()} />
            <ToolbarTextAlignOptions editor={editor} />
            <ToolbarListOptions editor={editor} />
            <ToolbarBtn
                title="Bold"
                isActive={isBold}
                Icon={TextBolder}
                onClick={() => {
                    editor.chain().focus().toggleBold().run()
                }}
            />
            <ToolbarBtn
                title="Italic"
                isActive={isItalic}
                Icon={TextItalic}
                onClick={() => {
                    editor.chain().focus().toggleItalic().run()
                }}
            />
            <ToolbarBtn
                title="Code"
                isActive={isCode}
                Icon={Code}
                onClick={() => {
                    editor.chain().focus().toggleCode().run()
                }}
            />
            <ToolbarBtn
                title="Code Block"
                isActive={isCodeBlock}
                Icon={BracketsCurly}
                onClick={() => {
                    editor.chain().focus().toggleCodeBlock().run()
                }}
            />
            <ToolbarLinkOption editor={editor} />
        </FlexRowAlignCenter>
    )
}
