import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import { useState } from 'react'
import { TBoard, TCard } from '../types'
import { Card } from './Card'

export const CanvasDndContext = ({ children }: { children: React.ReactNode }) => {
    const [currDraggedItem, setCurrDraggedItem] = useState<TCard | null>(null)

    return (
        <DndContext
            onDragStart={(event) => {
                const draggedItem = event.active.data.current?.item
                setCurrDraggedItem(draggedItem)
            }}
            onDragEnd={async (event) => {
                setCurrDraggedItem(null)
            }}
        >
            {children}

            {/* PLACEHOLDER PREVIEW-CARD DURING DRAGGING A CARD */}
            <DragOverlay dropAnimation={null}>
                {(() => {
                    if (!currDraggedItem) return null

                    return <Card id={currDraggedItem.id} content={currDraggedItem.content} />
                })()}
            </DragOverlay>
        </DndContext>
    )
}

type DroppableBoardHandlerProps = {
    id: string
    item?: TBoard
    children: ({ isOver }: { isOver: boolean }) => React.ReactNode
    style?: React.CSSProperties
}
export const DroppableBoardHandler = ({ id, item, children, style }: DroppableBoardHandlerProps) => {
    const { isOver: _isOver, setNodeRef, active } = useDroppable({ id, data: { item } })

    const isOver = active?.id !== id && _isOver

    return (
        <div ref={setNodeRef} style={style}>
            {children({ isOver })}
        </div>
    )
}

type DraggableCardHandlerProps = {
    id: string
    item: TCard
    children: React.ReactNode
}
export const DraggableCardHandler = ({ id, item, children }: DraggableCardHandlerProps) => {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id,
        data: { item },
    })

    return (
        <div
            ref={setNodeRef}
            style={{ ...(isDragging && { opacity: 0.5 }), userSelect: 'none', width: '100%' }}
            {...listeners}
            {...attributes}
        >
            {children}
        </div>
    )
}
