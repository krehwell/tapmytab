import { TLabel } from '../types.ts'

export const LABELS = [TLabel.Red, TLabel.Green, TLabel.Blue, TLabel.Yellow, TLabel.No]

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
        case TLabel.No:
            return 'transparent'
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
            return TLabel.No
        case TLabel.No:
        default:
            return TLabel.Red
    }
}
