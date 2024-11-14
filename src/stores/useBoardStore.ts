import { TBoard, TCard } from '../types'
import { create } from 'zustand'
import { arraySwap } from '@dnd-kit/sortable'
import { arrayMove } from '@dnd-kit/sortable'

type BoardBank = {
    [id: string]: TCard[]
}

type BoardStore = {
    boards: BoardBank | null
    populateBoards: (boards: BoardBank) => void
    deleteBoard: (id: string) => void
    swapCardPosById: (aId: string, bId: string) => void
    // moveCardBoard: (aId: string, bId: string) => void
}

export const useBoardStore = create<BoardStore>((set) => ({
    boards: null,
    populateBoards: (boards) => set({ boards }),
    deleteBoard: (id) => {
        set((state) => {
            delete state.boards?.[id]
            return { boards: state.boards }
        })
    },
    swapCardPosById: (aId, bId) => {
        set((state) => {
            const boards = state.boards as BoardBank
            const a = state.boards?.[aId] as TCard[]
            const b = state.boards?.[bId] as TCard[]

            return {
            }
        })
    },
}))
