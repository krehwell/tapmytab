import { Flex } from '../Flex'
import { useState } from 'react'
import { BOARD1, BOARD2 } from '../../utils/templates'
import { Card } from '../Card'
import { Board } from '../Board'
import { Navbar } from '../Navbar'
import { CanvasDndContext, DraggableCardHandler, DroppableBoardHandler } from '../BoardDndContext'
import { arrayMove } from '@dnd-kit/sortable'

export const App = ({ isExtension }: { isExtension: boolean }) => {
    const [boards, setBoards] = useState([BOARD1, BOARD2])

    return (
        <>
            <Navbar />

            <CanvasDndContext
                onDragOver={(e) => {
                    const { active, over } = e
                }}
                onDragEnd={(e) => {
                    const { active, over } = e
                }}
            >
                <Flex style={{ height: 'calc(100vh - 3.5rem)', backgroundColor: 'rgba(43, 47, 50, 1)' }}>
                    {boards.map((board) => (
                        <Board key={board.id} board={board}>
                            {board.cards.map((card) => (
                                <Card key={card.id} card={card} />
                            ))}
                        </Board>
                    ))}
                </Flex>
            </CanvasDndContext>
        </>
    )
}
