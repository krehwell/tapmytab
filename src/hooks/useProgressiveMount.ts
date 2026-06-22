import { useEffect, useState } from 'react'

/**
 * Mounts `initial` items right away, then reveals `step` more on each idle frame until it reaches `total`
 */
export const useProgressiveMount = <T>(
    items: T[],
    { initial = 8, step = 8 }: { initial?: number; step?: number } = {},
): { data: T[] } => {
    const [mounted, setMounted] = useState(initial)

    useEffect(() => {
        if (mounted >= items.length) return
        const id = requestIdleCallback(() => setMounted((m) => m + step))
        return () => cancelIdleCallback(id)
    }, [mounted, items.length, step])

    return { data: items.slice(0, mounted) }
}
