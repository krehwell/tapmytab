import { Editor as TiptapEditor } from '@tiptap/react'
import { ListBullets, ListDashes, ListNumbers } from '@phosphor-icons/react'
import { WithOptionsMenu } from '../../WithOptionsMenu.tsx'
import { ToolbarBtn } from './ToolbarBtn.tsx'
import { useTextmenuStates } from './useTextmenuStates.ts'

export const ToolbarListOptions = ({ editor }: { editor: TiptapEditor }) => {
    const { isOrderedList, isBulletList, isTaskList } = useTextmenuStates(editor)

    return (
        <WithOptionsMenu
            options={[
                {
                    label: 'Ordered List',
                    node: <ToolbarBtn isActive={isOrderedList} Icon={ListNumbers} />,
                    onClick: () => editor.chain().focus().toggleOrderedList().run(),
                },
                {
                    label: 'Bullet List',
                    node: <ToolbarBtn isActive={isBulletList} Icon={ListBullets} />,
                    onClick: () => editor.chain().focus().toggleBulletList().run(),
                },
                {
                    label: 'Task List',
                    node: <ToolbarBtn isActive={isTaskList} Icon={ListDashes} />,
                    onClick: () => editor.chain().focus().toggleTaskList().run(),
                },
            ]}
        >
            {({ openMenu }) => (
                <ToolbarBtn
                    title='Lists'
                    Icon={isOrderedList ? ListNumbers : isBulletList ? ListBullets : ListDashes}
                    onClick={openMenu}
                />
            )}
        </WithOptionsMenu>
    )
}
