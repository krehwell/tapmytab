export type TCard = {
    id: string
    title: string
    desc?: string
    content: string
    label?: TLabel
}

export type TBoard = {
    id: string
    cards: TCard[]
    name?: string
}

export enum TLabel {
    Red = 'red',
    Green = 'green',
    Blue = 'blue',
    Yellow = 'yellow',
}
