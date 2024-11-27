import { tc } from '../../../utils/themeColors.ts'
import { Button } from '../../Button.tsx'

export const ToolbarBtn = ({
    Icon,
    onClick,
    isActive,
    style,
    sx,
    ...props
}: {
    Icon: React.ElementType
    onClick?: (e) => void
    isActive?: boolean
} & React.ComponentProps<typeof Button>) => {
    return (
        <Button
            radius='2.8rem'
            onClick={onClick}
            style={{ boxShadow: !onClick ? 'none' : undefined, ...style }}
            sx={{
                backgroundColor: isActive ? tc.bgSecondary : 'transparent',
                '& svg': {
                    fill: isActive ? tc.textActivePrimary : undefined,
                },
                ...sx,
            }}
            {...props}
        >
            <Icon size={16} />
        </Button>
    )
}
