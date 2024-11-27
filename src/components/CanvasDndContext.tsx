import React from 'react'
import {
    closestCorners,
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import { useState } from 'react'
import { Card } from './Card.tsx'
import { TCard } from '../types.ts'
import { snapCenterToCursor } from '@dnd-kit/modifiers'

export const CanvasDndContext = ({
    children,
    onDragStart,
    onDragOver,
    onDragEnd,
}: {
    children: React.ReactNode
    onDragStart?: (e: DragStartEvent) => void
    onDragOver: (e: DragOverEvent) => void
    onDragEnd: (e: DragEndEvent) => void
}) => {
    const [currDraggedCard, setCurrDraggedCard] = useState<TCard | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
    )

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            modifiers={[snapCenterToCursor]}
            onDragStart={(e) => {
                setCurrDraggedCard(e.active.data.current?.card as TCard)
                onDragStart?.(e)
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
                    <Card card={currDraggedCard} disabled sortableCheat='' />
                </DragOverlay>
            )}
        </DndContext>
    )
}
