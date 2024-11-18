import React, { useCallback, useLayoutEffect } from 'react'
import { DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import { Board } from '../Board'
import { CanvasDndContext } from '../CanvasDndContext'
import { Flex } from '../Flex'
import { Navbar } from '../Navbar'
import { tc } from '../../utils/themeColors'
import { CardPopup } from '../CardPopup'
import { useBoardStore } from '../../stores/useBoardStore'
import { parseSortableCheat } from '../../utils/dndIdManager'
import { isInsideChromeExtension, StorageService } from '../../utils/chromeStorage'
import { BOARD1, BOARD2, BOARD3 } from '../../utils/templates'

useBoardStore.subscribe((store) => {
    if (!isInsideChromeExtension()) return
    StorageService.saveBoards(store.boards)
})

const popuplateInitialBoards = async () => {
    // if this app is a chrome tab extension. load the boards
    if (isInsideChromeExtension()) {
        const boards = (await StorageService.loadBoards()) || []
        useBoardStore.setState({ boards })
    } else {
        useBoardStore.setState({ boards: [BOARD1, BOARD2, BOARD3] })
    }
}

export const App = () => {
    const boards = useBoardStore((s) => s.boards)
    const swapCardPos = useBoardStore((s) => s.swapCardPos)
    const swapCardSwitchBoard = useBoardStore((s) => s.swapCardSwitchBoard)

    useLayoutEffect(() => {
        popuplateInitialBoards()
    }, [])

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
        },
        [boards]
    )

    const handleCardSwapPos = useCallback(
        (event: DragEndEvent) => {
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
        },
        [boards]
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
                <CanvasDndContext onDragOver={handleCardSwitchBoard} onDragEnd={handleCardSwapPos}>
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
