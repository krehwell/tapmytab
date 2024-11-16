import { Button } from './Button'
import { TLabel } from '../types'
import { getColorFromLabel } from '../utils/label'
import { tc } from '../utils/themeColors'

export const Label = ({
    label,
    style,
    onClick,
}: {
    label?: TLabel
    style?: React.CSSProperties
    onClick?: () => void
}) => {
    return (
        <Button
            onClick={onClick}
            style={{
                width: '5.1rem',
                height: '1.8rem',
                padding: '0.4rem',
                backgroundColor: tc.tokenGrey,
                borderRadius: '4px',
                ...style,
            }}
        >
            {label && (
                <div
                    style={{
                        height: '1rem',
                        width: '100%',
                        borderRadius: '0.4rem',
                        backgroundColor: getColorFromLabel({ label }),
                    }}
                />
            )}
        </Button>
    )
}
