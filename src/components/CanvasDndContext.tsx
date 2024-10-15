import {
    closestCorners,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { useState } from 'react'
import { SortableCard } from './Card'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'

export const CanvasDndContext = ({
    children,
    onDragStart,
    onDragOver,
    onDragEnd,
}: {
    children: React.ReactNode
    onDragStart: (e: DragEndEvent) => void
    onDragOver: (e: DragOverEvent) => void
    onDragEnd: (e: DragEndEvent) => void
}) => {
    // TODO: should be TCard
    const [currDraggedItem, setCurrDraggedItem] = useState<string | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragEnd={(e) => {
                onDragEnd(e)
                setCurrDraggedItem(null)
            }}
            onDragOver={onDragOver}
            onDragStart={(e) => {
                // TODO: should pass TCard from active.data
                setCurrDraggedItem(e.active.id)
                onDragStart(e)
            }}
        >
            {children}

            {/* PLACEHOLDER PREVIEW-CARD DURING DRAGGING A CARD */}
            {currDraggedItem && (
                <DragOverlay>
                    <SortableCard
                        card={{ id: currDraggedItem, content: 'content', title: 'title', desc: 'desc' }}
                        disabled
                    />
                </DragOverlay>
            )}
        </DndContext>
    )
}
