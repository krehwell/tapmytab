import { TCard } from '../types'
import { parseSortableCheat } from '../utils/dndIdManager';
import { useBoardStore } from './useBoardStore'

export const updateCard = ({
    sortableCheat,
    fields,
}: {
    sortableCheat: string;
    fields: Partial<TCard>
}) => {
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
