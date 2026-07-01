import React, { useCallback, useRef } from 'react'
import { useProgressiveMount } from '../../hooks/useProgressiveMount.ts'
import { DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { Board } from '../Board.tsx'
import { CanvasDndContext } from '../CanvasDndContext.tsx'
import { Flex } from '../Flex/index.tsx'
import { Navbar } from '../Navbar.tsx'
import { tc } from '../../utils/themeColors.ts'
import { CardPopup } from '../CardPopup.tsx'
import { SearchPopup } from '../SearchPopup.tsx'
import { useBoardStore } from '../../stores/useBoardStore.ts'
import { isInsideExtension, StorageService } from '../../utils/storage.ts'
import { BOARD1, BOARD2, BOARD3, BOARD4, perfBoards } from '../../utils/templates.ts'
import { FirstTimeService } from '../../utils/firstTimeChecker.ts'
import { isVersionOutdated, markVersionSeen, withIntroCard } from '../../utils/version.ts'

useBoardStore.subscribe((store) => {
    if (!store.isInitialized) return
    if (!isInsideExtension()) {
        console.log('dev: try to save...!')
        return
    }
    StorageService.saveBoards(store.boards)
})

const populateInitialBoards = async () => {
    if (isInsideExtension()) {
        const isFirstTime = await FirstTimeService.isFirstTime()
        if (isFirstTime) {
            useBoardStore.setState({
                boards: [BOARD1, BOARD2, BOARD3, BOARD4],
                isInitialized: true,
            })
        } else {
            let boards = (await StorageService.loadBoards()) || [BOARD1, BOARD2, BOARD3, BOARD4]
            if (await isVersionOutdated()) boards = withIntroCard(boards)
            useBoardStore.setState({ boards, isInitialized: true })
        }
        await markVersionSeen()
    } else {
        const perf = new URLSearchParams(globalThis.location?.search).get('perf')
        useBoardStore.setState({
            boards: perf ? perfBoards(perf) : [BOARD1, BOARD2, BOARD3, BOARD4],
            isInitialized: true,
        })
    }
}

if (typeof window != 'undefined') {
    populateInitialBoards()
}

export const App = () => {
    const boards = useBoardStore((s) => s.boards)
    const swapCardPos = useBoardStore((s) => s.swapCardPos)
    const swapCardSwitchBoard = useBoardStore((s) => s.swapCardSwitchBoard)

    // moving a card in onDragOver re-lays out the board, which makes dnd-kit
    // re-measure and synchronously re-fire onDragOver. Without a guard, rapid
    // back-and-forth drags cascade into "Maximum update depth exceeded".
    const isMovingRef = useRef(false)

    const { data: visibleBoards } = useProgressiveMount(boards, { initial: 6, step: 4 })

    const handleCardSwitchBoard = useCallback(
        (event: DragOverEvent) => {
            const { active, over } = event
            if (!active || !over) return

            const activeId = String(active.id)
            const actBoardIdx = boards.findIndex((b) => b.cards.some((c) => c.id === activeId))
            if (actBoardIdx === -1) return
            const actCardIdx = boards[actBoardIdx].cards.findIndex((c) => c.id === activeId)

            // `over` is either a card (use its board) or an empty board's droppable (its id)
            const overId = String(over.id)
            let ovrBoardIdx = boards.findIndex((b) => b.id === overId)
            let ovrCardIdx = -1
            if (ovrBoardIdx === -1) {
                ovrBoardIdx = boards.findIndex((b) => b.cards.some((c) => c.id === overId))
                ovrCardIdx = ovrBoardIdx === -1 ? -1 : boards[ovrBoardIdx].cards.findIndex((c) => c.id === overId)
            }
            if (ovrBoardIdx === -1 || actBoardIdx === ovrBoardIdx) return

            if (isMovingRef.current) return
            isMovingRef.current = true
            requestAnimationFrame(() => {
                isMovingRef.current = false
            })

            // over a card → insert at its slot; over an empty board → append
            const newIdx = ovrCardIdx === -1 ? boards[ovrBoardIdx].cards.length : ovrCardIdx

            swapCardSwitchBoard({
                currBoardIdx: actBoardIdx,
                currIdx: actCardIdx,
                newBoardIdx: ovrBoardIdx,
                newIdx,
            })
        },
        [boards],
    )

    const handleCardSwapPos = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event
            if (!over) return

            const activeId = String(active.id)
            const overId = String(over.id)

            const boardIdx = boards.findIndex((b) => b.cards.some((c) => c.id === activeId))
            if (boardIdx === -1) return

            const cards = boards[boardIdx].cards
            const currIdx = cards.findIndex((c) => c.id === activeId)
            const destIdx = cards.findIndex((c) => c.id === overId)
            // over is a board or a card in another board → the cross-board move already happened in onDragOver
            if (destIdx === -1 || currIdx === destIdx) return

            swapCardPos({ boardIdx, currIdx, newIdx: destIdx })
        },
        [boards],
    )

    return (
        <React.Fragment>
            <Navbar />
            <Flex
                style={{
                    height: 'calc(100vh - var(--navbar-height))',
                    padding: '0 3.2rem',
                    backgroundColor: tc.surfaceRaised,
                    overflowX: 'auto',
                }}
            >
                <CanvasDndContext
                    onDragOver={handleCardSwitchBoard}
                    onDragEnd={handleCardSwapPos}
                >
                    {visibleBoards.map((board, i) => {
                        return <Board key={board.id} index={i} board={board} />
                    })}
                </CanvasDndContext>
                <Board index={boards.length} isPlaceholder />
            </Flex>
            <CardPopup />
            <SearchPopup />
        </React.Fragment>
    )
}
