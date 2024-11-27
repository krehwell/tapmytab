import { TextAlignCenter, TextAlignLeft, TextAlignRight } from '@phosphor-icons/react'
import { WithOptionsMenu } from '../../WithOptionsMenu.tsx'
import { ToolbarBtn } from './ToolbarBtn.tsx'
import { useTextmenuStates } from './useTextmenuStates.ts'
import { Editor as TiptapEditor } from '@tiptap/react'

export const ToolbarTextAlignOptions = (
    { editor }: { editor: TiptapEditor },
) => {
    const { isAlignLeft, isAlignCenter, isAlignRight } = useTextmenuStates(
        editor,
    )

    return (
        <WithOptionsMenu
            options={[
                {
                    label: 'Left',
                    node: <ToolbarBtn isActive={isAlignLeft} Icon={TextAlignLeft} />,
                    onClick: () => editor.chain().focus().setTextAlign('left').run(),
                },
                {
                    label: 'center',
                    node: <ToolbarBtn isActive={isAlignCenter} Icon={TextAlignCenter} />,
                    onClick: () => editor.chain().focus().setTextAlign('center').run(),
                },
                {
                    label: 'Right',
                    node: <ToolbarBtn isActive={isAlignRight} Icon={TextAlignRight} />,
                    onClick: () => editor.chain().focus().setTextAlign('right').run(),
                },
            ]}
        >
            {({ openMenu }) => (
                <ToolbarBtn
                    title='Text Alignment'
                    Icon={isAlignCenter ? TextAlignCenter : isAlignRight ? TextAlignRight : TextAlignLeft}
                    onClick={openMenu}
                />
            )}
        </WithOptionsMenu>
    )
}
