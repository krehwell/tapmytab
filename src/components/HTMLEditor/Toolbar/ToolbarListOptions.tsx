import { Editor as TiptapEditor } from '@tiptap/react'
import { ListBullets, ListNumbers } from '@phosphor-icons/react'
import { WithOptionsMenu } from '../../WithOptionsMenu.tsx'
import { ToolbarBtn } from './ToolbarBtn.tsx'
import { useTextmenuStates } from './useTextmenuStates.ts'
import { ListChecks } from '@phosphor-icons/react'

export const ToolbarListOptions = ({ editor }: { editor: TiptapEditor }) => {
    const { isOrderedList, isBulletList, isTaskList } = useTextmenuStates(editor)

    return (
        <WithOptionsMenu
            options={[
                {
                    label: 'Bullet List',
                    node: <ToolbarBtn isActive={isBulletList} Icon={ListBullets} />,
                    onClick: () => editor.chain().focus().toggleBulletList().run(),
                },
                {
                    label: 'Ordered List',
                    node: <ToolbarBtn isActive={isOrderedList} Icon={ListNumbers} />,
                    onClick: () => editor.chain().focus().toggleOrderedList().run(),
                },
                {
                    label: 'Task List',
                    node: <ToolbarBtn isActive={isTaskList} Icon={ListChecks} />,
                    onClick: () => editor.chain().focus().toggleTaskList().run(),
                },
            ]}
        >
            {({ openMenu }) => (
                <ToolbarBtn
                    title='Lists'
                    Icon={isOrderedList ? ListNumbers : isBulletList ? ListBullets : ListChecks}
                    onClick={openMenu}
                />
            )}
        </WithOptionsMenu>
    )
}
