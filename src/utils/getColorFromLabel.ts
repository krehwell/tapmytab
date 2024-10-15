import { TLabel } from '../types'

export const getLabelFromColor = ({ label }: { label: TLabel }) => {
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
