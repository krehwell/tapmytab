import { TLabel } from '../types.ts'
import { tc } from './themeColors.ts'

export const LABELS = [
    TLabel.Red,
    TLabel.Green,
    TLabel.Blue,
    TLabel.Yellow,
    TLabel.No,
]

export const getColorFromLabel = ({ label }: { label: TLabel }) => {
    switch (label) {
        case TLabel.Red:
            return tc.labelRed
        case TLabel.Green:
            return tc.labelGreen
        case TLabel.Blue:
            return tc.labelBlue
        case TLabel.Yellow:
            return tc.labelOrange
        case TLabel.No:
            return 'transparent'
    }
}
