import { cn } from '../../utils/cn'
import {
    Flex,
    FlexColumn,
    FlexColumnAlignJustifyCenter,
    FlexRowAlignCenter,
} from '../Flex'
import { DndContext } from '@dnd-kit/core'
import { useDroppable } from '@dnd-kit/core'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'
import { useState } from 'react'

const TEMPLATE = `
<h1 id="sample-markdown">Sample Markdown</h1>
<p>This is some basic, sample markdown.</p>
<h2 id="second-heading">Second Heading</h2>
<ul>
<li>Unordered lists, and:<ol>
<li>One</li>
<li>Two</li>
<li>Three</li>
</ol>
</li>
<li>More</li>
</ul>
<blockquote>
<p>Blockquote</p>
</blockquote>
`

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
            style={{
                width: '18.75rem',
                padding: '0.75rem',
                alignItems: 'center',
                gap: '1.5rem',
                borderRight: '6px solid #313436',
                overflowY: 'scroll',
                overflowX: 'hidden',
            }}
        >
            <FlexRowAlignCenter style={{ width: '100%', color: '#F8F9FA' }}>
                <h1
                    style={{
                        fontFamily: '"Rumiko Clear Demo"',
                        fontSize: '1.9375rem',
                        fontWeight: '700',
                    }}
                >
                    {title}
                </h1>
                <span
                    style={{
                        marginLeft: 'auto',
                        fontWeight: 'bold',
                        fontSize: '2rem',
                    }}
                >
                    +
                </span>
            </FlexRowAlignCenter>
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
            style={{
                padding: '0.5rem',
                gap: '0.625rem',
                borderRadius: '0.75rem',
                background: '#343A40',
                width: '100%',
                ...style,
            }}
            {...listeners}
            {...attributes}
        >
            <h2
                style={{
                    color: '#F8F9FA',
                    fontFamily: '"Rumiko Clear Demo"',
                    fontSize: '1.25rem',
                    fontWeight: '700',
                }}
            >
                title
            </h2>
            <p
                style={{
                    color: 'rgba(248, 249, 250, 0.80)',
                    fontFamily: '"Rumiko Clear Demo"',
                    fontSize: '0.8125rem',
                }}
            >
                desc
            </p>
            <span
                style={{
                    width: '2.6875rem',
                    height: '0.625rem',
                    backgroundColor: '#FFAEAD',
                    borderRadius: '0.25rem',
                }}
            />
            <FlexColumn
                dangerouslySetInnerHTML={{ __html: content }}
                style={{
                    padding: '1rem 0.25rem',
                    color: '#F8F9FA',
                    borderRadius: '0.5rem',
                    background: '#2C3034',
                    /* SF Pro Display/13px: Regular */
                    fontFamily: '"Rumiko Clear Demo"',
                    fontSize: '0.8125rem',
                    fontStyle: 'normal',
                    fontWeight: '400',
                    lineHeight: 'normal',
                }}
            />
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

const Navbar = () => {
    return (
        <FlexRowAlignCenter
            as="nav"
            style={{
                padding: '0.75rem 33.75rem 0.6875rem 1.5rem',
                alignItems: 'flex-start',
                gap: '23.25rem',
                backgroundColor: 'rgba(47, 51, 54, 1)',
                height: '3.5rem',
                width: '100%',
            }}
        >
            <span
                style={{
                    color: '#5F6061',
                    fontFamily: '"Rumiko Sans Demo"',
                    fontSize: '1.5rem',
                    fontWeight: '700',
                    height: 'fit-content',
                    margin: 'auto 0',
                }}
            >
                Tap my Tab
            </span>
        </FlexRowAlignCenter>
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
        <>
            <Navbar />

            <Flex
                style={{
                    height: 'calc(100vh - 3.5rem)',
                    backgroundColor: 'rgba(43, 47, 50, 1)',
                }}
            >
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
                            {board.cards.map((card) => (
                                <Card
                                    key={card.id}
                                    id={card.id}
                                    className="border-2 border-solid rounded"
                                    content={TEMPLATE || card.content}
                                />
                            ))}
                        </Board>
                    ))}
                </DndContext>
            </Flex>
        </>
    )
}
