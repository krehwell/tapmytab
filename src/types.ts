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
    title?: string
}

export type TLabel = {
    id: string
    title: string
    color: string
}
