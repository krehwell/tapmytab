import { Editor as TiptapEditor } from '@tiptap/react'
import { TextHThree, TextHTwo } from '@phosphor-icons/react'
import { WithOptionsMenu } from '../../WithOptionsMenu.tsx'
import { ToolbarBtn } from './ToolbarBtn.tsx'
import { useTextmenuStates } from './useTextmenuStates.ts'
import { TextHOne } from '@phosphor-icons/react/dist/ssr'
import { TextHFour } from '@phosphor-icons/react'
import { Paragraph } from '@phosphor-icons/react'

export const ToolbarHeadingOptions = ({ editor }: { editor: TiptapEditor }) => {
    const { isH1, isH2, isH3, isH4, isParagraph } = useTextmenuStates(editor)

    return (
        <WithOptionsMenu
            options={[
                {
                    label: 'Paragraph',
                    node: <ToolbarBtn isActive={isParagraph} Icon={Paragraph} />,
                    onClick: () =>
                        editor.chain().focus().lift('taskItem').liftListItem('listItem').setParagraph().run(),
                },
                {
                    label: 'H1',
                    node: <ToolbarBtn isActive={isH1} Icon={TextHOne} />,
                    onClick: () =>
                        editor.chain().focus().lift('taskItem').liftListItem('listItem').setHeading({ level: 1 })
                            .run(),
                },
                {
                    label: 'Ordered List',
                    node: <ToolbarBtn isActive={isH2} Icon={TextHTwo} />,
                    onClick: () =>
                        editor.chain().focus().lift('taskItem').liftListItem('listItem').setHeading({ level: 2 })
                            .run(),
                },
                {
                    label: 'Task List',
                    node: <ToolbarBtn isActive={isH3} Icon={TextHThree} />,
                    onClick: () =>
                        editor.chain().focus().lift('taskItem').liftListItem('listItem').setHeading({ level: 3 })
                            .run(),
                },
                {
                    label: 'Task List',
                    node: <ToolbarBtn isActive={isH4} Icon={TextHFour} />,
                    onClick: () =>
                        editor.chain().focus().lift('taskItem').liftListItem('listItem').setHeading({ level: 4 })
                            .run(),
                },
            ]}
        >
            {({ openMenu }) => (
                <ToolbarBtn
                    title='Lists'
                    Icon={isH1 ? TextHOne : isH2 ? TextHTwo : isH3 ? TextHThree : isH4 ? TextHFour : Paragraph}
                    onClick={openMenu}
                />
            )}
        </WithOptionsMenu>
    )
}
