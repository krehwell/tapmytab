import React, { useCallback, useRef } from 'react'

/** Drag the background horizontally to scroll a container. */
export const useDragScroll = () => {
    const ref = useRef<HTMLElement>(null)
    const start = useRef<{ x: number; scrollLeft: number } | null>(null)

    const stop = useCallback((e: React.PointerEvent<HTMLElement>) => {
        start.current = null
        e.currentTarget.style.userSelect = ''
    }, [])

    const onPointerDown = useCallback((e: React.PointerEvent<HTMLElement>) => {
        // check the target itself, not closest() — only explicit bg elements start a drag
        if (!(e.target as HTMLElement).hasAttribute?.('data-scroll-bg')) return

        e.currentTarget.style.userSelect = 'none' // wiggly drags over text must not select it
        start.current = { x: e.clientX, scrollLeft: e.currentTarget.scrollLeft }
        e.currentTarget.setPointerCapture(e.pointerId)
    }, [])

    const onPointerMove = useCallback((e: React.PointerEvent<HTMLElement>) => {
        if (!start.current || !ref.current) return
        ref.current.scrollLeft = start.current.scrollLeft - (e.clientX - start.current.x)
    }, [])

    // the container itself is always background — spreading these props marks it
    return { ref, 'data-scroll-bg': '', onPointerDown, onPointerMove, onPointerUp: stop, onPointerCancel: stop }
}
