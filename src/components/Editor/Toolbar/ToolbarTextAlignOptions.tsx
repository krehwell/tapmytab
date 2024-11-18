import { TextAlignLeft, TextAlignCenter, TextAlignRight } from 'phosphor-react'
import { tc } from '../../../utils/themeColors'
import { WithOptionsMenu } from '../../WithOptionsMenu'
import { ToolbarBtn } from './ToolbarBtn'
import { useTextmenuStates } from './useTextmenuStates'
import { Editor as TiptapEditor } from '@tiptap/react'

export const ToolbarTextAlignOptions = ({ editor }: { editor: TiptapEditor }) => {
    const { isAlignLeft, isAlignCenter, isAlignRight } = useTextmenuStates(editor)

    return (
        <WithOptionsMenu
            menuItemProps={{ sx: { backgroundColor: tc.bgSecondary } }}
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
                    title="Text Alignment"
                    Icon={isAlignCenter ? TextAlignCenter : isAlignRight ? TextAlignRight : TextAlignLeft}
                    onClick={openMenu}
                />
            )}
        </WithOptionsMenu>
    )
}
