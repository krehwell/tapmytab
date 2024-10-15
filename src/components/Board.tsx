import { useDroppable } from '@dnd-kit/core'
import { SortableContext } from '@dnd-kit/sortable'
import { TBoard } from '../types'
import { FlexColumn, FlexRowAlignCenter } from './Flex'

export const Board = ({ board, children }: { board: TBoard; children: React.ReactNode }) => {
    const { isOver: _isOver, setNodeRef, active } = useDroppable({ id: board?.id, data: { item: board } })

    const isOver = active?.id !== board.id && _isOver

    return (
        <FlexColumn
            style={{
                width: '18.75rem',
                padding: '0.75rem',
                borderRight: '6px solid #313436',
                height: '100%',
                // overflowY: 'scroll',
                // overflowX: 'hidden',
            }}
        >
            <FlexRowAlignCenter style={{ width: '100%', color: '#F8F9FA' }}>
                <h1 style={{ fontFamily: '"Rumiko Clear Demo"', fontSize: '1.9375rem', fontWeight: '700' }}>
                    {board.title}
                </h1>
                <span title="Add Card" style={{ marginLeft: 'auto', fontWeight: 'bold', fontSize: '2rem' }}>
                    +
                </span>
            </FlexRowAlignCenter>
            <SortableContext id={board.id} items={board.cards}>
                <FlexColumn as="ul" ref={setNodeRef} style={{ alignItems: 'center', gap: '1.5rem' }}>
                    {children}
                </FlexColumn>
            </SortableContext>
        </FlexColumn>
    )
}
