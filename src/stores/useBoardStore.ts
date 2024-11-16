import { TBoard, TCard } from '../types'
import { create } from 'zustand'
import { arrayMove } from '@dnd-kit/sortable'
import { BOARD1, BOARD2 } from '../utils/templates'
import genUid from 'light-uid'

type BoardBank = Array<TBoard>

type BoardStore = {
    boards: BoardBank
    populateBoards: (boards: BoardBank) => void
    addNewCard: (props: { idx: number }) => void
    addNewBoard: (props: { id: string; name: string; idx: number }) => void
    changeBoardName: (props: { idx: number; name: string }) => void
    deleteBoard: (props: { idx: number }) => void
    duplicateBoard: (props: { idx: number }) => void
    swapCardPos: (props: { boardIdx: number; currIdx: number; newIdx: number }) => void
    swapCardSwitchBoard: (props: { currBoardIdx: number; currIdx: number; newBoardIdx: number; newIdx: number }) => void
}

export const useBoardStore = create<BoardStore>((set, get) => ({
    boards: [BOARD1, BOARD2],
    populateBoards: (boards) => set({ boards }),
    addNewCard: ({ idx }) => {
        const newCard: TCard = {
            id: genUid(8),
            content: '',
            title: 'New Card',
        }
        const boards = [...get().boards]
        const board = boards[idx]
        board.cards.unshift(newCard)
        set({ boards })
    },
    addNewBoard: ({ id, name, idx }) => {
        const newBoard: TBoard = { id, name, cards: [] }
        const boards = [...get().boards]
        boards.splice(idx + 1, 0, newBoard)
        set({ boards })
    },
    duplicateBoard: ({ idx }) => {
        const newBoard = get().boards[idx]
        const boards = [...get().boards]
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
