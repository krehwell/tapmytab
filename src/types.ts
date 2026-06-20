export type TExcalidraw = {
    elements: readonly unknown[]
    files: Record<string, unknown>
}

export type TCard = {
    id: string
    title: string
    desc?: string
    content: string | TExcalidraw
    label: TLabel
    dueDate?: null | string
}

export const isExcalidraw = (content: TCard['content']): content is TExcalidraw => typeof content !== 'string'

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
    No = 'transparent',
}
