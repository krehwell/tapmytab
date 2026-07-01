import { useRef } from 'react'

/**
 * Keeps a ref pointing at the latest `value` on every render.
 * Handy for reading a fresh prop/callback inside an effect that must only run once
 * (an event listener bound in a `[]` effect), without re-subscribing when it changes.
 */
export const useRefMyFunc = <T>(value: T) => {
    const ref = useRef(value)
    ref.current = value
    return ref
}
