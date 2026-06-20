import { useRef } from 'react'
import { FlexRowAlignCenter } from '../../Flex/index.tsx'
import {
    ArrowUUpLeft,
    ArrowUUpRight,
    BracketsCurly,
    Code,
    Image as ImageIcon,
    TextBolder,
    TextItalic,
} from '@phosphor-icons/react'
import { Editor as TiptapEditor } from '@tiptap/react'
import { useTextmenuStates } from './useTextmenuStates.ts'
import { ToolbarBtn } from './ToolbarBtn.tsx'
import { ToolbarLinkOptions } from './ToolbarLinkOptions.tsx'
import { ToolbarListOptions } from './ToolbarListOptions.tsx'
import { ToolbarTextAlignOptions } from './ToolbarTextAlignOptions.tsx'
import { tc } from '../../../utils/themeColors.ts'
import { ToolbarHeadingOptions } from './ToolbarHeadingOptions.tsx'

export const Toolbar = ({ editor }: { editor: TiptapEditor }) => {
    const { isBold, isItalic, isCode, isCodeBlock } = useTextmenuStates(editor)
    const fileInput = useRef<HTMLInputElement>(null)

    const onPickImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        e.target.value = ''
        if (!file) return
        const reader = new FileReader()
        reader.onload = () => editor.chain().focus().setImage({ src: String(reader.result) }).run()
        reader.readAsDataURL(file)
    }

    return (
        <FlexRowAlignCenter
            style={{
                backgroundColor: tc.surfaceOverlay,
                borderRadius: '0rem 0rem 0.8rem 0.8rem',
                gap: '0.8rem',
                padding: '0.4rem 0.8rem',
                height: '3.6rem',
            }}
        >
            <ToolbarBtn
                title='Undo'
                Icon={ArrowUUpLeft}
                onClick={() => editor.chain().undo().run()}
            />
            <ToolbarBtn
                title='Redo'
                Icon={ArrowUUpRight}
                onClick={() => editor.chain().redo().run()}
            />
            <ToolbarHeadingOptions editor={editor} />
            <ToolbarTextAlignOptions editor={editor} />
            <ToolbarListOptions editor={editor} />
            <ToolbarBtn
                title='Bold'
                isActive={isBold}
                Icon={TextBolder}
                onClick={() => {
                    editor.chain().focus().toggleBold().run()
                }}
            />
            <ToolbarBtn
                title='Italic'
                isActive={isItalic}
                Icon={TextItalic}
                onClick={() => {
                    editor.chain().focus().toggleItalic().run()
                }}
            />
            <ToolbarBtn
                title='Code'
                isActive={isCode}
                Icon={Code}
                onClick={() => {
                    editor.chain().focus().toggleCode().run()
                }}
            />
            <ToolbarBtn
                title='Code Block'
                isActive={isCodeBlock}
                Icon={BracketsCurly}
                onClick={() => {
                    editor.chain().focus().toggleCodeBlock().run()
                }}
            />
            <ToolbarBtn
                title='Image'
                Icon={ImageIcon}
                onClick={() => fileInput.current?.click()}
            />
            <ToolbarLinkOptions editor={editor} />
            <input
                ref={fileInput}
                type='file'
                accept='image/*'
                hidden
                onChange={onPickImage}
            />
        </FlexRowAlignCenter>
    )
}
