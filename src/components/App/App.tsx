import { Flex } from '../Flex'
import { useState } from 'react'
import { BOARD1, BOARD2 } from '../../utils/templates'
import { Card } from '../Card'
import { Board } from '../Board'
import { Navbar } from '../Navbar'
import { CanvasDndContext, DraggableCardHandler, DroppableBoardHandler } from '../BoardDndContext'

export const App = ({ isExtension }: { isExtension: boolean }) => {
    const [boards, setBoards] = useState([BOARD1, BOARD2])

    return (
        <>
            <Navbar />

            <CanvasDndContext>
                <Flex style={{ height: 'calc(100vh - 3.5rem)', backgroundColor: 'rgba(43, 47, 50, 1)' }}>
                    {boards.map((board) => (
                        <DroppableBoardHandler
                            id={board.id}
                            item={board}
                            style={{ overflowY: 'scroll', overflowX: 'hidden', height: '100%' }}
                        >
                            {({ isOver }) => {
                                return (
                                    <Board key={board.id} title={board.title}>
                                        {board.cards.map((card) => (
                                            <DraggableCardHandler id={board.id + card.id} item={card}>
                                                <Card key={card.id} id={card.id} content={card.content} />
                                            </DraggableCardHandler>
                                        ))}
                                    </Board>
                                )
                            }}
                        </DroppableBoardHandler>
                    ))}
                </Flex>
            </CanvasDndContext>
        </>
    )
}
