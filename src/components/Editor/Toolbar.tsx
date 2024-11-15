import { Button } from '../Button'
import { FlexRowAlignCenter } from '../Flex'
import { WithOptionsMenu } from '../WithOptionsMenu'
import {
    ArrowUUpLeft,
    ArrowUUpRight,
    BracketsCurly,
    Code,
    Link,
    ListBullets,
    ListDashes,
    ListNumbers,
    TextAlignCenter,
    TextAlignLeft,
    TextAlignRight,
    TextBolder,
    TextItalic,
} from 'phosphor-react'
import { Editor as TiptapEditor } from '@tiptap/react'
import { tc } from '../../utils/themeColors'

import { Editor } from '@tiptap/react'

export const useTextmenuStates = (editor: Editor) => {
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

const ToolbarBtn = ({
    Icon,
    onClick,
    isActive,
}: {
    Icon: React.ElementType
    onClick?: (e) => void
    isActive?: boolean
}) => {
    return (
        <Button radius="2.8rem" onClick={onClick} sx={{ backgroundColor: isActive ? tc.bgSecondary : 'transparent' }}>
            <Icon size={16} />
        </Button>
    )
}

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
            <ToolbarBtn Icon={ArrowUUpLeft} onClick={() => editor.chain().undo().run()} />
            <ToolbarBtn Icon={ArrowUUpRight} onClick={() => editor.chain().redo().run()} />
            <ToolbarTextAlignOptions editor={editor} />
            <ToolbarListOptions editor={editor} />
            <ToolbarBtn
                isActive={isBold}
                Icon={TextBolder}
                onClick={() => {
                    editor.chain().focus().toggleBold().run()
                }}
            />
            <ToolbarBtn
                isActive={isItalic}
                Icon={TextItalic}
                onClick={() => {
                    editor.chain().focus().toggleItalic().run()
                }}
            />
            <ToolbarBtn
                isActive={isCode}
                Icon={Code}
                onClick={() => {
                    editor.chain().focus().toggleCode().run()
                }}
            />
            <ToolbarBtn
                isActive={isCodeBlock}
                Icon={BracketsCurly}
                onClick={() => {
                    editor.chain().focus().toggleCodeBlock().run()
                }}
            />
            <ToolbarBtn
                Icon={Link}
                onClick={() => {
                    alert('TODO: linkify me')
                }}
            />
        </FlexRowAlignCenter>
    )
}

const ToolbarTextAlignOptions = ({ editor }: { editor: TiptapEditor }) => {
    const { isAlignLeft, isAlignCenter, isAlignRight } = useTextmenuStates(editor)

    return (
        <WithOptionsMenu
            menuItemProps={{ sx: { backgroundColor: tc.bgSecondary } }}
            options={[
                {
                    label: 'Left',
                    node: (
                        <ToolbarBtn
                            isActive={isAlignLeft}
                            Icon={TextAlignLeft}
                            onClick={() => editor.chain().focus().setTextAlign('left').run()}
                        />
                    ),
                },
                {
                    label: 'center',
                    node: (
                        <ToolbarBtn
                            isActive={isAlignCenter}
                            Icon={TextAlignCenter}
                            onClick={() => editor.chain().focus().setTextAlign('center').run()}
                        />
                    ),
                },
                {
                    label: 'Right',
                    node: (
                        <ToolbarBtn
                            isActive={isAlignRight}
                            Icon={TextAlignRight}
                            onClick={() => editor.chain().focus().setTextAlign('right').run()}
                        />
                    ),
                },
            ]}
        >
            {({ openMenu }) => (
                <ToolbarBtn
                    Icon={isAlignCenter ? TextAlignCenter : isAlignRight ? TextAlignRight : TextAlignLeft}
                    onClick={openMenu}
                />
            )}
        </WithOptionsMenu>
    )
}

const ToolbarListOptions = ({ editor }: { editor: TiptapEditor }) => {
    const { isOrderedList, isBulletList, isTaskList } = useTextmenuStates(editor)

    return (
        <WithOptionsMenu
            menuItemProps={{ sx: { backgroundColor: tc.bgSecondary } }}
            options={[
                {
                    label: 'Ordered List',
                    node: (
                        <ToolbarBtn
                            isActive={isOrderedList}
                            Icon={ListNumbers}
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                        />
                    ),
                },
                {
                    label: 'Bullet List',
                    node: (
                        <ToolbarBtn
                            isActive={isBulletList}
                            Icon={ListBullets}
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                        />
                    ),
                },
                {
                    label: 'Task List',
                    node: (
                        <ToolbarBtn
                            isActive={isTaskList}
                            Icon={ListDashes}
                            onClick={() => editor.chain().focus().toggleTaskList().run()}
                        />
                    ),
                },
            ]}
        >
            {({ openMenu }) => (
                <ToolbarBtn
                    Icon={isOrderedList ? ListNumbers : isBulletList ? ListBullets : ListDashes}
                    onClick={openMenu}
                />
            )}
        </WithOptionsMenu>
    )
}
