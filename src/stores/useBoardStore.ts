import { TBoard, TCard } from '../types'
import { create } from 'zustand'
import { arrayMove } from '@dnd-kit/sortable'
import { BOARD1, BOARD2 } from '../utils/templates'

type BoardBank = Array<TBoard>

type BoardStore = {
    boards: BoardBank
    populateBoards: (boards: BoardBank) => void
    deleteBoard: ({ idx }: { idx: number }) => void
    swapCardPos: (props: { boardIdx: number; currIdx: number; newIdx: number }) => void
    swapCardSwitchBoard: (props: { currBoardIdx: number; currIdx: number; newBoardIdx: number; newIdx: number }) => void
}

export const useBoardStore = create<BoardStore>((set, get) => ({
    boards: [BOARD1, BOARD2],
    populateBoards: (boards) => set({ boards }),
    deleteBoard: ({ idx }) => {
        const boards = [...get().boards]
        boards.splice(idx, 1)
        set({ boards })
    },
    swapCardPos: ({ boardIdx, currIdx, newIdx }) => {
        const boards = [...get().boards]
        const newBoard = boards[boardIdx]
        let newCards = newBoard.cards
        newCards = arrayMove(newCards, currIdx, newIdx)

        newBoard.cards = newCards
        boards[boardIdx] = newBoard

        set({ boards: boards })
    },
    swapCardSwitchBoard: ({ currBoardIdx, currIdx, newBoardIdx, newIdx }) => {
        const boards = [...get().boards]

        const currBoard = boards[currBoardIdx]
        const newBoard = boards[newBoardIdx]

        let currCards = currBoard.cards
        let newCards = newBoard.cards

        const currCard = currCards[currIdx]
        currCards = currCards.filter((_, i) => i !== currIdx)

        newCards.unshift(currCard)
        newCards = arrayMove(newCards, 0, newIdx)

        currBoard.cards = currCards
        newBoard.cards = newCards

        set({ boards })
    },
}))
