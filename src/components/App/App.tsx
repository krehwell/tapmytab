import React, { useState } from 'react'
import { DragOverEvent, DragEndEvent } from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { Board } from '../Board'
import { CanvasDndContext } from '../CanvasDndContext'
import { Flex } from '../Flex'
import { TCard, TLabel } from '../../types'
import { Navbar } from '../Navbar'

// find board id by passing boardId or cardId
const findBoard = (id: string, boards: Record<string, TCard[]>) => {
    if (id in boards) {
        return id
    }

    for (const key in boards) {
        if (boards[key].some((item) => item.id === id)) {
            return key
        }
    }

    throw new Error('Board not found')
}

export const App = () => {
    const [boards, setBoards] = useState<Record<string, TCard[]>>({
        Latest: [
            { id: 'card-1', content: 'content card - 1', title: 'card - 1', desc: 'desc card 1', label: TLabel.Red },
            { id: 'card-2', content: 'content card - 2', title: 'card - 2', desc: 'desc card 2', label: TLabel.Blue },
            { id: 'card-3', content: 'content card - 3', title: 'card - 3', desc: 'desc card 3' },
        ],
        'To-dos': [
            { id: 'card-4', content: 'content card - 4', title: 'card - 4', desc: 'desc card 4', label: TLabel.Yellow },
            { id: 'card-5', content: 'content card - 5', title: 'card - 5', desc: 'desc card 5' },
        ],
        Done: [
            { id: 'card-6', content: 'content card - 7', title: 'card - 6', desc: 'desc card 6' },
            { id: 'card-7', content: 'content card - 8', title: 'card - 7', desc: 'desc card 7', label: TLabel.Green },
        ],
    })

    console.log(boards)

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over, draggingRect } = event
        const { id } = active
        const { id: overId } = over

        const activeBoard = findBoard(id, boards)
        const overBoard = findBoard(overId, boards)

        if (!activeBoard || !overBoard || activeBoard === overBoard) {
            return
        }

        setBoards((prev) => {
            const activeCards = prev[activeBoard]
            const overCards = prev[overBoard]

            const activeIndex = activeCards.findIndex((item) => item.id === id)
            const overIndex = overCards.findIndex((item) => item.id === overId)

            let newIndex
            if (Object.keys(prev).includes(overId)) {
                newIndex = overCards.length + 1
            } else {
                if (!draggingRect) {
                    newIndex = overCards.length + 1
                } else {
                    const isBelowLastItem =
                        over &&
                        overIndex === overCards.length - 1 &&
                        draggingRect.offsetTop > over.rect.offsetTop + over.rect.height

                    const modifier = isBelowLastItem ? 1 : 0

                    newIndex = overIndex >= 0 ? overIndex + modifier : overCards.length + 1
                }
            }

            return {
                ...prev,
                [activeBoard]: activeCards.filter((item) => item.id !== id), // Fix here, use `id`
                [overBoard]: [...overCards.slice(0, newIndex), activeCards[activeIndex], ...overCards.slice(newIndex)],
            }
        })
    }

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event
        const { id } = active
        const { id: overId } = over

        const activeBoard = findBoard(id as string, boards)
        const overBoard = findBoard(overId, boards)

        if (!activeBoard || !overBoard || activeBoard !== overBoard) {
            return
        }

        const activeIndex = boards[activeBoard].findIndex((card) => card.id === id)
        const overIndex = boards[overBoard].findIndex((card) => card.id === overId)

        if (activeIndex !== overIndex) {
            setBoards((items) => ({
                ...items,
                [overBoard]: arrayMove(items[overBoard], activeIndex, overIndex),
            }))
        }
    }

    return (
        <React.Fragment>
            <Navbar />
            <Flex style={{ height: 'calc(100vh - 56px)', backgroundColor: '#2B2F32', overflowX: 'auto' }}>
                <CanvasDndContext onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                    {Object.keys(boards).map((key, i) => {
                        const boardTitle = key
                        const cards = boards[key]
                        return <Board key={key + i} board={{ id: key, title: boardTitle, cards }} />
                    })}
                </CanvasDndContext>
                <Board
                    board={{ id: null, cards: [] }}
                    onNewCreated={({ id }) => {
                        setBoards((prev) => {
                            const newBoard = { ...prev, [id]: [] }
                            return newBoard
                        })
                    }}
                />
            </Flex>
        </React.Fragment>
    )
}
