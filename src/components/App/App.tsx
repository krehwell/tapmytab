import React, { useCallback } from 'react'
import { DragEndEvent, DragOverEvent } from '@dnd-kit/core'
import { Board } from '../Board.tsx'
import { CanvasDndContext } from '../CanvasDndContext.tsx'
import { Flex } from '../Flex/index.tsx'
import { Navbar } from '../Navbar.tsx'
import { tc } from '../../utils/themeColors.ts'
import { CardPopup } from '../CardPopup.tsx'
import { useBoardStore } from '../../stores/useBoardStore.ts'
import { parseSortableCheat } from '../../utils/dndIdManager.ts'
import { isInsideExtension, StorageService } from '../../utils/storage.ts'
import { BOARD1, BOARD2 } from '../../utils/templates.ts'
import { FirstTimeService } from '../../utils/firstTimeChecker.ts'

useBoardStore.subscribe((store) => {
    if (!store.isInitialized) return
    if (!isInsideExtension()) {
        console.log('dev: try to save...!')
        return
    }
    StorageService.saveBoards(store.boards)
})

const populateInitialBoards = async () => {
    // if this app is an extension. load the boards
    if (isInsideExtension()) {
        const isFirstTime = await FirstTimeService.isFirstTime()
        if (isFirstTime) {
            useBoardStore.setState({
                boards: [BOARD1, BOARD2],
                isInitialized: true,
            })
        } else {
            const boards = (await StorageService.loadBoards()) || [BOARD1, BOARD2]
            useBoardStore.setState({ boards, isInitialized: true })
        }
    } else {
        useBoardStore.setState({ boards: [BOARD1, BOARD2], isInitialized: true })
    }
}

if (typeof window != 'undefined') {
    populateInitialBoards()
}

export const App = () => {
    const boards = useBoardStore((s) => s.boards)
    const swapCardPos = useBoardStore((s) => s.swapCardPos)
    const swapCardSwitchBoard = useBoardStore((s) => s.swapCardSwitchBoard)

    const handleCardSwitchBoard = useCallback(
        (event: DragOverEvent) => {
            const { active, over, draggingRect } = event

            if (!active || !over) return

            let actBoardIdx = 0,
                actCardId = '',
                actCardIdx = 0
            let ovrBoardIdx = 0,
                ovrCardIdx = 0

            if (active.data.current) {
                const { boardIdx, cardId, cardIdx } = parseSortableCheat(
                    active.data.current.sortableCheat,
                )
                actBoardIdx = boardIdx
                actCardId = cardId
                actCardIdx = cardIdx
            }

            if (over.data.current) {
                const { boardIdx, cardIdx } = parseSortableCheat(
                    over.data.current.sortableCheat,
                )
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
                    const isBelowLastItem = ovrCardIdx === ovrCards.length - 1 &&
                        draggingRect.offsetTop >
                            over.rect.offsetTop + over.rect.height

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
        },
        [boards],
    )

    const handleCardSwapPos = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event

            if (!active.data.current || !over?.data.current) return

            const { sortableCheat: actSortCht } = active.data.current
            const { sortableCheat: ovrSortCht } = over.data.current
            if (!actSortCht || !ovrSortCht) {
                throw new Error(
                    '`activeSortableCheat | overSortableCheat` is invalid',
                )
            }

            const { boardIdx, cardIdx } = parseSortableCheat(actSortCht)
            const { boardIdx: destBoardIdx, cardIdx: destCardIdx } = parseSortableCheat(ovrSortCht)

            if (boardIdx !== destBoardIdx) return

            swapCardPos({ boardIdx, currIdx: cardIdx, newIdx: destCardIdx })
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
                    backgroundColor: tc.bgSecondary,
                    overflowX: 'auto',
                }}
            >
                <CanvasDndContext
                    onDragOver={handleCardSwitchBoard}
                    onDragEnd={handleCardSwapPos}
                >
                    {boards.map((board, i) => {
                        return <Board key={board.id} index={i} board={board} />
                    })}
                </CanvasDndContext>
                <Board index={boards.length} isPlaceholder />
            </Flex>
            <CardPopup />
        </React.Fragment>
    )
}
