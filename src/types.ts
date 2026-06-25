export type TExcalidraw = {
    elements: readonly unknown[]
    files: Record<string, unknown>

    // cached <svg> markup of the scene (generated in the editor iframe). lets the card render a
    // thumbnail without loading excalidraw in the main app. absent until the card is opened/edited.
    preview?: string
}

export type TCard = {
    id: string
    title: string
    desc?: string
    content: string | TExcalidraw
    label: TLabel
    dueDate?: null | string
}

export const isExcalidrawCard = (card: TCard): card is TCard & { content: TExcalidraw } =>
    typeof card.content !== 'string'

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
