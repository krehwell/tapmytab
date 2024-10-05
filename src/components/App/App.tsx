import { cn } from '../../utils/cn'
import { Flex, FlexColumn, FlexColumnAlignJustifyCenter } from '../Flex'
import { DndContext } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

const Board = ({
    title,
    className,
    children,
    id,
}: {
    title: string
    className?: string
    children: React.ReactNode
    id: string
}) => {
    const { setNodeRef } = useDroppable({
        id,
        data: {
            id,
            title,
        },
    })

    return (
        <FlexColumn
            ref={setNodeRef}
            className={cn('card gap-6', className)}
            style={{ width: '20rem' }}
        >
            <h1 className="notice">{title}</h1>
            {children}
        </FlexColumn>
    )
}

const Card = ({
    className,
    id,
    content,
}: {
    className?: string
    id: string
    content: string
}) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: id,
        data: { id, content },
    })
    const style = {
        transform: CSS.Translate.toString(transform),
    }

    return (
        <FlexColumn
            className="relative"
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
        >
            <textarea className={cn('resize-y', className)} value={content} />
            <button style={{ position: 'absolute', top: 0, right: 0 }}>
                open
            </button>
        </FlexColumn>
    )
}

const AddCard = ({ onClick }: { onClick: () => void }) => {
    return (
        <FlexColumnAlignJustifyCenter
            as="button"
            onClick={onClick}
            className={cn('border-2 border-solid rounded h-8')}
        >
            +
        </FlexColumnAlignJustifyCenter>
    )
}

const CARDS_1 = [
    { id: 'card-a', content: 'Card 1' },
    { id: 'card-b', content: 'Card 2' },
    { id: 'card-c', content: 'Card 3' },
]

const CARDS_2 = [{ id: 'card-d', content: 'Card 1' }]

const CARDS_3 = [
    { id: 'card-e', content: 'Card 1' },
    { id: 'card-f', content: 'Card 2' },
    { id: 'card-g', content: 'Card 3' },
]

export const App = ({ isExtension }: { isExtension: boolean }) => {
    const [boards, setBoards] = useState([
        { id: 'board-1', title: 'Column 1', cards: CARDS_1 },
        { id: 'board-2', title: 'Column 2', cards: CARDS_2 },
        { id: 'board-3', title: 'Column 2', cards: [] },
        { id: 'board-4', title: 'Column 3', cards: CARDS_3 },
    ])

    return (
        <Flex className="gap-3 p-2" style={{ height: 'calc(100vh - 1rem)' }}>
            <DndContext
                onDragEnd={({ active, over }) => {
                    const draggedCard = active.data.current as {
                        id: string
                        content: string
                    }
                    const overBoard = over?.data.current as {
                        id: string
                        title: string
                    }

                    setBoards((boards) => {
                        const oldBoardIndex = boards.findIndex((board) =>
                            board.cards.some(
                                (card) => card.id === draggedCard.id
                            )
                        )
                        const newBoardIndex = boards.findIndex(
                            (board) => board.id === overBoard.id
                        )
                        
                        if (oldBoardIndex === newBoardIndex) {
                            return boards
                        }

                        const newBoards = [...boards]

                        const [removedCard] = newBoards[
                            oldBoardIndex
                        ].cards.splice(
                            newBoards[oldBoardIndex].cards.findIndex(
                                (card) => card.id === draggedCard.id
                            ),
                            1
                        )

                        newBoards[newBoardIndex].cards.push(removedCard)

                        return newBoards
                    })
                }}
            >
                {boards.map((board) => (
                    <Board
                        key={board.id}
                        title={board.title}
                        id={board.id}
                        className="border-2 border-solid rounded"
                    >
                        <AddCard
                            onClick={() => alert(`${board.id}: Add new card`)}
                        />
                        {board.cards.map((card) => (
                            <Card
                                key={card.id}
                                id={card.id}
                                className="border-2 border-solid rounded"
                                content={card.content}
                            />
                        ))}
                    </Board>
                ))}
            </DndContext>
        </Flex>
    )
}
