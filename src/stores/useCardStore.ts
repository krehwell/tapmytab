import { TCard } from '../types.ts'
import { parseSortableCheat } from '../utils/dndIdManager.ts'
import { useBoardStore } from './useBoardStore.ts'

export const updateCard = (
    { sortableCheat, fields }: { sortableCheat: string; fields: Partial<TCard> },
) => {
    useBoardStore.setState((s) => {
        const { boardIdx, cardIdx } = parseSortableCheat(sortableCheat)

        const boards = [...s.boards]
        const card = boards[boardIdx].cards[cardIdx]

        for (const key in fields) {
            card[key] = fields[key]
        }

        boards[boardIdx].cards[cardIdx] = card

        return { boards }
    })
}

export const deleteCard = ({ sortableCheat }: { sortableCheat: string }) => {
    useBoardStore.setState((s) => {
        const { boardIdx, cardIdx } = parseSortableCheat(sortableCheat)

        const boards = [...s.boards]
        boards[boardIdx].cards.splice(cardIdx, 1)

        return { boards }
    })
}
