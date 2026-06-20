import { memo, useEffect, useRef } from 'react'
import { TExcalidraw } from '../../types.ts'

const SRC = '/pages/excalidraw.html'

// excalidraw can't be sized inside the app: rem is relative to the app's 62.5% root.
// zoom/scale won't help.  so we render it in iframe instead lol
export const DrawingEditor = memo(
    ({ data, onChange }: { data: TExcalidraw; onChange: (next: TExcalidraw) => void }) => {
        const onChangeRef = useRef(onChange)
        onChangeRef.current = onChange
        const dataRef = useRef(data)
        const iframeRef = useRef<HTMLIFrameElement>(null)

        useEffect(() => {
            const onMessage = (e: MessageEvent) => {
                if (e.source !== iframeRef.current?.contentWindow) return
                if (e.data?.type === 'excalidraw:ready') {
                    iframeRef.current?.contentWindow?.postMessage(
                        { type: 'excalidraw:init', data: dataRef.current },
                        '*',
                    )
                } else if (e.data?.type === 'excalidraw:change') {
                    onChangeRef.current(e.data.data)
                }
            }
            globalThis.addEventListener('message', onMessage)
            return () => globalThis.removeEventListener('message', onMessage)
        }, [])

        return (
            <iframe
                ref={iframeRef}
                src={SRC}
                title='Excalidraw'
                style={{
                    width: '100%',
                    height: '60rem',
                    border: 'none',
                    borderRadius: '0.8rem',
                    display: 'block',
                    backgroundColor: '#111111',
                }}
            />
        )
    },
    () => true,
)
