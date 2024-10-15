import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core'
import { useState } from 'react'
import { TBoard, TCard } from '../types'
import { Card } from './Card'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export const CanvasDndContext = ({
    children,
    onDragEnd,
    onDragOver,
}: {
    children: React.ReactNode
    onDragEnd: (e: DragEndEvent) => void
    onDragOver: (e: DragOverEvent) => void
}) => {
    const [currDraggedItem, setCurrDraggedItem] = useState<TCard | null>(null)

    return (
        <DndContext
            onDragStart={(event) => {
                const draggedItem = event.active.data.current?.item
                setCurrDraggedItem(draggedItem)
            }}
            onDragEnd={onDragEnd}
            onDragOver={onDragOver}
        >
            {children}

            {/* PLACEHOLDER PREVIEW-CARD DURING DRAGGING A CARD */}
            {/* <DragOverlay dropAnimation={null}> */}
            {/*     {(() => { */}
            {/*         if (!currDraggedItem) return null */}

            {/*         return <Card card={currDraggedItem} /> */}
            {/*     })()} */}
            {/* </DragOverlay> */}
        </DndContext>
    )
}

type DroppableBoardHandlerProps = {
    item: TBoard
    children: ({ isOver }: { isOver: boolean }) => React.ReactNode
    style?: React.CSSProperties
}
export const DroppableBoardHandler = ({ item, children, style }: DroppableBoardHandlerProps) => {
    const { isOver: _isOver, setNodeRef, active } = useDroppable({ id: item?.id, data: { item } })

    const isOver = active?.id !== item?.id && _isOver

    return (
        <div ref={setNodeRef} style={style}>
            {children({ isOver })}
        </div>
    )
}

type DraggableCardHandlerProps = {
    item: TCard
    children: React.ReactNode
}
export const DraggableCardHandler = ({ item, children }: DraggableCardHandlerProps) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: item.id,
        data: { item },
    })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef}
            style={{ ...(isDragging && { opacity: 0.5 }), userSelect: 'none', width: '100%', ...style }}
            {...listeners}
            {...attributes}
        >
            {children}
        </div>
    )
}
