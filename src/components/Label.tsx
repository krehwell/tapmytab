import { Button } from './Button.tsx'
import { TLabel } from '../types.ts'
import { getColorFromLabel } from '../utils/label.ts'
import { tc } from '../utils/themeColors.ts'

export const Label = ({
    label,
    style,
    onClick,
}: {
    label: TLabel
    style?: React.CSSProperties
    onClick?: (e: React.MouseEvent) => void
}) => {
    return (
        <Button
            tabIndex={-1}
            onClick={onClick}
            style={{
                width: '5.1rem',
                height: '1.8rem',
                padding: '0.4rem',
                backgroundColor: tc.tokenGrey,
                borderRadius: '4px',
                boxShadow: !onClick ? 'none' : undefined,
                cursor: onClick ? 'pointer' : 'default',
                ...style,
            }}
        >
            <div
                style={{
                    height: '1rem',
                    width: '100%',
                    borderRadius: '0.4rem',
                    backgroundColor: getColorFromLabel({ label }),
                }}
            />
        </Button>
    )
}
