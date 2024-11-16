import { TLabel } from '../types'

export const getColorFromLabel = ({ label }: { label: TLabel }) => {
    switch (label) {
        case TLabel.Red:
            return '#FFAEAD'
        case TLabel.Green:
            return '#CAFFBF'
        case TLabel.Blue:
            return '#9BF6FF'
        case TLabel.Yellow:
            return '#FED7A5'
    }
}

export const cycleNextLabel = ({ label }: { label?: TLabel }) => {
    switch (label) {
        case TLabel.Red:
            return TLabel.Green
        case TLabel.Green:
            return TLabel.Blue
        case TLabel.Blue:
            return TLabel.Yellow
        case TLabel.Yellow:
            return null
        default:
            return TLabel.Red
    }
}
