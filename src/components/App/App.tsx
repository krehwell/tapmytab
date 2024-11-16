import React, { useCallback } from 'react'
import { DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import { Board } from '../Board'
import { CanvasDndContext } from '../CanvasDndContext'
import { Flex } from '../Flex'
import { Navbar } from '../Navbar'
import { tc } from '../../utils/themeColors'
import { CardPopup } from '../CardPopup'
import { useBoardStore } from '../../stores/useBoardStore'
import { parseSortableCheat } from '../../utils/dndIdManager'

// useBoardStore.subscribe((store) => {
//     const b0 = store.boards[0]
//     const b1 = store.boards[1]
//     console.table(b0.cards)
//     console.table(b1.cards)
// })

export const App = () => {
    const boards = useBoardStore((s) => s.boards)
    const swapCardPos = useBoardStore((s) => s.swapCardPos)
    const swapCardSwitchBoard = useBoardStore((s) => s.swapCardSwitchBoard)

    const handleCardSwitchBoard = useCallback((event: DragOverEvent) => {
        const { active, over, draggingRect } = event

        if (!active || !over) return

        let actBoardIdx = 0,
            actCardId = '',
            actCardIdx = 0
        let ovrBoardIdx = 0,
            ovrCardIdx = 0

        if (active.data.current) {
            const { boardIdx, cardId, cardIdx } = parseSortableCheat(active.data.current.sortableCheat)
            actBoardIdx = boardIdx
            actCardId = cardId
            actCardIdx = cardIdx
        }

        if (over.data.current) {
            const { boardIdx, cardIdx } = parseSortableCheat(over.data.current.sortableCheat)
            ovrBoardIdx = boardIdx
            ovrCardIdx = cardIdx
        } else {
            // empty board leaves empty `over.data.current` somehow. detect id manually instead
            const ovrBoardId = over.id
            ovrBoardIdx = boards.findIndex((board) => board.id === ovrBoardId)
        }

        if (actBoardIdx === ovrBoardIdx) return

        const ovrBoard = boards[ovrBoardIdx]
        const ovrCards = ovrBoard.cards

        let newIdx: number
        if (ovrCards.findIndex((card) => card.id === actCardId) !== -1) {
            newIdx = ovrCards.length + 1
        } else {
            if (!draggingRect) {
                newIdx = ovrCards.length + 1
            } else {
                const isBelowLastItem =
                    ovrCardIdx === ovrCards.length - 1 &&
                    draggingRect.offsetTop > over.rect.offsetTop + over.rect.height

                const modifier = isBelowLastItem ? 1 : 0
                newIdx = ovrCardIdx >= 0 ? ovrCardIdx + modifier : ovrCards.length + 1
            }
        }

        swapCardSwitchBoard({
            currBoardIdx: actBoardIdx,
            currIdx: actCardIdx,
            newBoardIdx: ovrBoardIdx,
            newIdx: newIdx,
        })
    }, [])

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
