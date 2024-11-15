export const createSortableCheat = ({
    boardId,
    cardId,
    boardIdx,
    cardIdx,
}: {
    boardId: string
    cardId: string
    boardIdx: number
    cardIdx: number
}) => {
    return `${boardId}#${boardIdx}-${cardId}#${cardIdx}`
}

export const parseSortableCheat = (id: string) => {
    const [board, card] = id.split('-')
    const [boardId, boardIdx] = board.split('#')
    const [cardId, cardIdx] = card.split('#')

    return { boardId, boardIdx: +boardIdx, cardId, cardIdx: +cardIdx }
}
