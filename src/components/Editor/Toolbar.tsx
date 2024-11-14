import { Button } from '../Button'
import { FlexRowAlignCenter } from '../Flex'
import { WithOptionsMenu } from '../WithOptionsMenu'
import {
    ArrowUUpLeft,
    ArrowUUpRight,
    Code,
    Link,
    List,
    TextAlignCenter,
    TextAlignLeft,
    TextAlignRight,
    TextBolder,
    TextItalic,
} from 'phosphor-react'
import { Editor as TiptapEditor } from '@tiptap/react'
import { tc } from '../../utils/themeColors'

const ToolbarBtn = ({ Icon, onClick }: { Icon: React.ElementType; onClick?: (e) => void }) => {
    return (
        <Button radius="2.8rem" onClick={onClick}>
            <Icon size={16} />
        </Button>
    )
}

export const Toolbar = ({ editor }: { editor: TiptapEditor }) => {
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
            <ToolbarBtn Icon={ArrowUUpLeft} />
            <ToolbarBtn Icon={ArrowUUpRight} />
            <WithOptionsMenu
                menuItemProps={{
                    sx: {
                        backgroundColor: tc.bgSecondary,
                    },
                }}
                options={[
                    { label: 'Left', node: <ToolbarBtn Icon={TextAlignLeft} /> },
                    { label: 'center', node: <ToolbarBtn Icon={TextAlignCenter} /> },
                    { label: 'Right', node: <ToolbarBtn Icon={TextAlignRight} /> },
                ]}
            >
                {({ openMenu }) => <ToolbarBtn Icon={List} onClick={openMenu} />}
            </WithOptionsMenu>
            <ToolbarBtn Icon={TextBolder} />
            <ToolbarBtn Icon={TextItalic} />
            <ToolbarBtn Icon={Code} />
            <ToolbarBtn Icon={Link} />
        </FlexRowAlignCenter>
    )
}
