import {
    closestCorners,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { useState } from 'react'
import { SortableCard } from './Card'
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { TCard } from '../types'

export const CanvasDndContext = ({
    children,
    onDragStart,
    onDragOver,
    onDragEnd,
}: {
    children: React.ReactNode
    onDragStart: (e: DragStartEvent) => void
    onDragOver: (e: DragOverEvent) => void
    onDragEnd: (e: DragEndEvent) => void
}) => {
    const [currDraggedCard, setCurrDraggedCard] = useState<TCard | null>(null)

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
            onDragStart={(e) => {
                setCurrDraggedCard(e.active.data.current as TCard)
                onDragStart(e)
            }}
            onDragOver={onDragOver}
            onDragEnd={(e) => {
                onDragEnd(e)
                setCurrDraggedCard(null)
            }}
        >
            {children}

            {/* PLACEHOLDER PREVIEW-CARD DURING DRAGGING A CARD */}
            {currDraggedCard && (
                <DragOverlay>
                    <SortableCard card={currDraggedCard} disabled />
                </DragOverlay>
            )}
        </DndContext>
    )
}
