import { memo, useEffect, useRef, useState } from 'react'
import { TExcalidraw } from '../../types.ts'
import { useRefMyFunc } from '../../hooks/useRefMyFunc.ts'

const SRC = '/pages/excalidraw.html'

// excalidraw can't be sized inside the app: rem is relative to the app's 62.5% root.
// zoom/scale won't help.  so we render it in iframe instead haha :D.
// how this communicates with I frame is by "../../../pages/excalidraw.tsx"  browser postMessage.
export const DrawingEditor = memo(
    ({ data, onChange, onSave, onExit }: {
        data: TExcalidraw
        onChange: (next: TExcalidraw) => void
        onSave?: () => void
        onExit?: () => void
    }) => {
        const onChangeRef = useRefMyFunc(onChange)
        const onSaveRef = useRefMyFunc(onSave)
        const onExitRef = useRefMyFunc(onExit)

        const sceneRef = useRef<TExcalidraw>(data)
        const iframeRef = useRef<HTMLIFrameElement>(null)
        const [isFullscreen, setIsFullscreen] = useState(false)

        useEffect(() => {
            const onMessage = (e: MessageEvent) => {
                if (e.source !== iframeRef.current?.contentWindow) return

                if (e.data?.type === 'excalidraw:fullscreen') {
                    setIsFullscreen(!!e.data.value)
                } else if (e.data?.type === 'excalidraw:save') {
                    onSaveRef.current?.()
                } else if (e.data?.type === 'excalidraw:exit') {
                    onExitRef.current?.()
                } else if (e.data?.type === 'excalidraw:ready') {
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
                style={{
                    border: 'none',
                    display: 'block',
                    backgroundColor: '#161718',
                    ...(isFullscreen
                        ? {
                            position: 'fixed',
                            inset: 0,
                            width: '100vw',
                            height: '100vh',
                            borderRadius: 0,
                            zIndex: 9999,
                        }
                        : { width: '100%', height: '60rem', borderRadius: '0.8rem' }),
                }}
            />
        )
    },
    () => true,
)
