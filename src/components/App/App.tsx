import React, { useCallback } from 'react'
import { DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import { Board } from '../Board'
import { CanvasDndContext } from '../CanvasDndContext'
import { Flex } from '../Flex'
import { Navbar } from '../Navbar'
import { tc } from '../../utils/themeColors'
import { CardPopup } from '../CardPopup'
import { useBoardStore } from '../../stores/useBoardStore'
import { BOARD1, BOARD2 } from '../../utils/templates'
import { parseSortableCheat } from '../../utils/dndIdManager'

export const App = () => {
    const boards = useBoardStore((s) => s.boards)
    const populateBoards = useBoardStore((s) => s.populateBoards)
    const swapCardPos = useBoardStore((s) => s.swapCardPos)
    const swapCardSwitchBoard = useBoardStore((s) => s.swapCardSwitchBoard)

    if (!boards) {
        populateBoards([BOARD1, BOARD2])
    }

    // const [boards, setBoards] = useState<Record<string, TCard[]>>({
    //     Latest: [
    //         { id: 'card-1', content: 'content card - 1', title: 'card - 1', desc: 'desc card 1', label: TLabel.Red },
    //         { id: 'card-2', content: 'content card - 2', title: 'card - 2', desc: 'desc card 2', label: TLabel.Blue },
    //         { id: 'card-3', content: 'content card - 3', title: 'card - 3', desc: 'desc card 3' },
    //     ],
    //     'To-dos': [
    //         { id: 'card-4', content: 'content card - 4', title: 'card - 4', desc: 'desc card 4', label: TLabel.Yellow },
    //         { id: 'card-5', content: 'content card - 5', title: 'card - 5', desc: 'desc card 5' },
    //     ],
    //     Done: [
    //         { id: 'card-6', content: 'content card - 7', title: 'card - 6', desc: 'desc card 6' },
    //         { id: 'card-7', content: 'content card - 8', title: 'card - 7', desc: 'desc card 7', label: TLabel.Green },
    //     ],
    // })

    const handleCardSwitchBoard = (event: DragOverEvent) => {
        // const { active, over, draggingRect } = event
        // const { id } = active
        // const { id: overId } = over
        // const activeBoard = findBoard(id, boards)
        // const overBoard = findBoard(overId, boards)
        // if (!activeBoard || !overBoard || activeBoard === overBoard) {
        //     return
        // }
        // setBoards((prev) => {
        //     const activeCards = prev[activeBoard]
        //     const overCards = prev[overBoard]
        //     const activeIndex = activeCards.findIndex((item) => item.id === id)
        //     const overIndex = overCards.findIndex((item) => item.id === overId)
        //     let newIndex
        //     if (Object.keys(prev).includes(overId)) {
        //         newIndex = overCards.length + 1
        //     } else {
        //         if (!draggingRect) {
        //             newIndex = overCards.length + 1
        //         } else {
        //             const isBelowLastItem =
        //                 over &&
        //                 overIndex === overCards.length - 1 &&
        //                 draggingRect.offsetTop > over.rect.offsetTop + over.rect.height
        //             const modifier = isBelowLastItem ? 1 : 0
        //             newIndex = overIndex >= 0 ? overIndex + modifier : overCards.length + 1
        //         }
        //     }
        //     return {
        //         ...prev,
        //         [activeBoard]: activeCards.filter((item) => item.id !== id), // Fix here, use `id`
        //         [overBoard]: [...overCards.slice(0, newIndex), activeCards[activeIndex], ...overCards.slice(newIndex)],
        //     }
        // })
    }

    const handleCardSwapPos = useCallback((event: DragEndEvent) => {
        const { active, over } = event

        if (!active.data.current || !over?.data.current) return

        const { sortableCheat: actSortCht } = active.data.current
        const { sortableCheat: ovrSortCht } = over.data.current
        if (!actSortCht || !ovrSortCht) {
            throw new Error('`activeSortableCheat | overSortableCheat` is invalid')
        }

        const { boardIdx, cardIdx } = parseSortableCheat(actSortCht)
        const { boardIdx: destBoardIdx, cardIdx: destCardIdx } = parseSortableCheat(ovrSortCht)

        if (boardIdx !== destBoardIdx) return

        swapCardPos({ boardIdx, currIdx: cardIdx, newIdx: destCardIdx })
    }, [])

    if (!boards) {
        return null
    }

    return (
        <React.Fragment>
            <Navbar />
            <Flex
                style={{
                    height: 'calc(100vh - var(--navbar-height))',
                    padding: '0 3.2rem',
                    backgroundColor: tc.bgSecondary,
                    overflowX: 'auto',
                }}
            >
                <CanvasDndContext onDragOver={handleCardSwitchBoard} onDragEnd={handleCardSwapPos}>
                    {boards.map((board, i) => {
                        return (
                            <Board
                                key={board.id}
                                index={i}
                                board={board}
                                onNewCreated={({ id, index }) => {
                                    // const newBoard = [id, []] as [string, TCard[]]
                                    // const newBoards = Object.entries(boards)
                                    // newBoards.splice(index, 0, newBoard)
                                    // setBoards(Object.fromEntries(newBoards))
                                }}
                            />
                        )
                    })}
                    {/* {Object.keys(boards).map((key, i) => { */}
                    {/*     const boardTitle = key */}
                    {/*     const cards = boards[key] */}
                    {/*     return ( */}
                    {/*         <Board */}
                    {/*             key={key + i} */}
                    {/*             index={i} */}
                    {/*             board={{ id: key, title: boardTitle, cards }} */}
                    {/*             onNewCreated={({ id, index }) => { */}
                    {/*                 const newBoard = [id, []] as [string, TCard[]] */}
                    {/*                 const newBoards = Object.entries(boards) */}
                    {/*                 newBoards.splice(index, 0, newBoard) */}
                    {/*                 setBoards(Object.fromEntries(newBoards)) */}
                    {/*             }} */}
                    {/*         /> */}
                    {/*     ) */}
                    {/* })} */}
                </CanvasDndContext>
                {/* <Board */}
                {/*     board={{ id: null, cards: [] }} */}
                {/*     index={Object.keys(boards).length} */}
                {/*     onNewCreated={({ id }) => { */}
                {/*         // setBoards((prev) => { */}
                {/*         //     const newBoard = { ...prev, [id]: [] } */}
                {/*         //     return newBoard */}
                {/*         // }) */}
                {/*     }} */}
                {/* /> */}
            </Flex>
            <CardPopup />
        </React.Fragment>
    )
}
