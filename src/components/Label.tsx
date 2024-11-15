import { TLabel } from '../types'
import { getColorFromLabel } from '../utils/getColorFromLabel'
import { tc } from '../utils/themeColors'

export const Label = ({ label, style }: { label?: TLabel; style?: React.CSSProperties }) => {
    if (!label) return null

    return (
        <span
            style={{
                width: '5.1rem',
                height: '1.8rem',
                padding: '0.4rem',
                backgroundColor: tc.tokenGrey,
                borderRadius: '4px',
                ...style,
            }}
        >
            <div style={{ height: '1rem', borderRadius: '0.4rem', backgroundColor: getColorFromLabel({ label }) }} />
        </span>
    )
}
