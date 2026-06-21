import { TBoard, TCard, TLabel } from '../types.ts'
import { create } from 'zustand'
import { arrayMove } from '@dnd-kit/sortable'
import { genUid } from 'light-uid'
import { emojify } from '../utils/emojify.ts'

type BoardStore = {
    boards: TBoard[]
    isInitialized: boolean
    addNewCard: (props: { idx: number; excalidraw?: boolean }) => void
    addNewBoard: (props: { id: string; name: string; idx: number }) => void
    changeBoardName: (props: { idx: number; name: string }) => void
    deleteBoard: (props: { idx: number }) => void
    duplicateBoard: (props: { idx: number }) => void
    swapCardPos: (props: {
        boardIdx: number
        currIdx: number
        newIdx: number
    }) => void
    swapCardSwitchBoard: (props: {
        currBoardIdx: number
        currIdx: number
        newBoardIdx: number
        newIdx: number
    }) => void
}

export const useBoardStore = create<BoardStore>((set, get) => ({
    boards: [],
    isInitialized: false,
    addNewCard: ({ idx, excalidraw }) => {
        const newCard: TCard = {
            id: genUid(8),
            content: excalidraw ? { elements: [], files: {} } : '',
            title: excalidraw ? 'New Drawing' : 'New Card',
            label: TLabel.No,
        }
        const boards = [...get().boards]
        const board = boards[idx]
        board.cards.unshift(newCard)
        set({ boards })
    },
    addNewBoard: ({ id, name, idx }) => {
        const newCard: TCard = { id: genUid(8), content: '', title: 'New card', label: TLabel.No }
        const newBoard: TBoard = { id, name, cards: [newCard] }
        const boards = [...get().boards]
        boards.splice(idx + 1, 0, newBoard)
        set({ boards })
    },
    duplicateBoard: ({ idx }) => {
        const boards = [...get().boards]

        const newBoard = Object.assign({}, boards[idx])
        newBoard.id = genUid(8)
        const newCards = newBoard.cards.map((card) => ({
            ...card,
            id: genUid(8),
        }))
        newBoard.cards = newCards

        boards.splice(idx + 1, 0, newBoard)
        set({ boards })
    },
    changeBoardName: ({ idx, name }) => {
        const boards = [...get().boards]
        boards[idx].name = name
        set({ boards })
    },
    deleteBoard: ({ idx }) => {
        const boards = [...get().boards]
        boards.splice(idx, 1)
        set({ boards })
    },
    swapCardPos: ({ boardIdx, currIdx, newIdx }) => {
        const boards = [...get().boards]
        const cards = arrayMove(boards[boardIdx].cards, currIdx, newIdx)
        boards[boardIdx] = { ...boards[boardIdx], cards }
        set({ boards })
    },
    swapCardSwitchBoard: ({ currBoardIdx, currIdx, newBoardIdx, newIdx }) => {
        const boards = [...get().boards]

        const card = boards[currBoardIdx].cards[currIdx]
        if (!card) return

        // clone both card arrays — never mutate state in place
        const currCards = boards[currBoardIdx].cards.filter((_, i) => i !== currIdx)
        const newCards = [...boards[newBoardIdx].cards]
        newCards.splice(newIdx, 0, card) // splice clamps out-of-range to the end

        boards[currBoardIdx] = { ...boards[currBoardIdx], cards: currCards }
        boards[newBoardIdx] = { ...boards[newBoardIdx], cards: newCards }

        set({ boards })
    },
}))
