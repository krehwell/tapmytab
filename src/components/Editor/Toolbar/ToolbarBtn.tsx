import { tc } from '../../../utils/themeColors'
import { Button } from '../../Button'

export const ToolbarBtn = ({
    Icon,
    onClick,
    isActive,
    style,
    ...props
}: {
    Icon: React.ElementType
    onClick?: (e) => void
    isActive?: boolean
} & React.ComponentProps<typeof Button>) => {
    return (
        <Button
            radius="2.8rem"
            onClick={onClick}
            style={{ boxShadow: !onClick ? 'none' : undefined, ...style }}
            sx={{ backgroundColor: isActive ? tc.bgSecondary : 'transparent' }}
            {...props}
        >
            <Icon size={16} />
        </Button>
    )
}
