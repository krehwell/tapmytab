import { memo, useEffect, useRef } from 'react'
import { TExcalidraw } from '../../types.ts'

const SRC = '/pages/excalidraw.html'

// excalidraw can't be sized inside the app: rem is relative to the app's 62.5% root.
// zoom/scale won't help.  so we render it in iframe instead haha :D.
// how this communicates with I frame is by "../../../pages/excalidraw.tsx"  browser postMessage.
// fullscreen is handled inside the iframe via the native Fullscreen API (allow='fullscreen').
export const DrawingEditor = memo(
    ({ data, onChange }: { data: TExcalidraw; onChange: (next: TExcalidraw) => void }) => {
        const onChangeRef = useRef(onChange)
        onChangeRef.current = onChange

        const sceneRef = useRef<TExcalidraw>(data)
        const iframeRef = useRef<HTMLIFrameElement>(null)

        useEffect(() => {
            const onMessage = (e: MessageEvent) => {
                if (e.source !== iframeRef.current?.contentWindow) return

                if (e.data?.type === 'excalidraw:ready') {
                    iframeRef.current?.contentWindow?.postMessage(
                        { type: 'excalidraw:init', data: sceneRef.current },
                        '*',
                    )
                } else if (e.data?.type === 'excalidraw:change') {
                    sceneRef.current = { ...sceneRef.current, ...e.data.data }
                    onChangeRef.current(sceneRef.current)
                } else if (e.data?.type === 'excalidraw:preview') {
                    sceneRef.current = { ...sceneRef.current, preview: e.data.preview }
                    onChangeRef.current(sceneRef.current)
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
                allow='fullscreen'
                style={{
                    width: '100%',
                    height: '60rem',
                    border: 'none',
                    borderRadius: '0.8rem',
                    display: 'block',
                    backgroundColor: '#161718',
                }}
            />
        )
    },
    () => true,
)
