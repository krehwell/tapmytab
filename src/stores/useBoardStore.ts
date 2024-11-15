import { TBoard, TCard } from '../types'
import { create } from 'zustand'
import { arrayMove } from '@dnd-kit/sortable'

type BoardBank = Array<TBoard>

type BoardStore = {
    boards: BoardBank | null
    populateBoards: (boards: BoardBank) => void
    deleteBoard: ({ id }: { id: string }) => void
    swapCardPos: (props: { boardIdx: number; currIdx: number; newIdx: number }) => void
    swapCardSwitchBoard: (props: {
        boardIdx: number
        cardIdx: number
        destBoardIdx: number
        destCardIdx: number
    }) => void
}

export const useBoardStore = create<BoardStore>((set, get) => ({
    boards: null,
    populateBoards: (boards) => set({ boards }),
    deleteBoard: ({ id }) => {},
    swapCardPos: ({ boardIdx, currIdx, newIdx }) => {
        const newBoards = get().boards as BoardBank
        const newBoard = newBoards[boardIdx] as TBoard
        let newCards = newBoard.cards as TCard[]
        newCards = arrayMove(newCards, currIdx, newIdx)

        newBoard.cards = newCards
        newBoards[boardIdx] = newBoard

        set({ boards: newBoards })
    },
    swapCardSwitchBoard: ({ boardIdx, cardIdx, destBoardIdx, destCardIdx }) => {
        //
    },
}))
