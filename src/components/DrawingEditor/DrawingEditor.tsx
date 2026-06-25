import { memo, useEffect, useRef } from 'react'
import { ArrowsInSimple, ArrowsOutSimple } from '@phosphor-icons/react'
import { TExcalidraw } from '../../types.ts'
import { Button } from '../Button.tsx'
import { tc } from '../../utils/themeColors.ts'

const SRC = '/pages/excalidraw.html'

// excalidraw can't be sized inside the app: rem is relative to the app's 62.5% root.
// zoom/scale won't help.  so we render it in iframe instead haha :D.  
// how this communicates with I frame is by "../../../pages/excalidraw.tsx"  browser postMessage.
export const DrawingEditor = memo(
    (
        { data, onChange, fullscreen, onToggleFullscreen }: {
            data: TExcalidraw
            onChange: (next: TExcalidraw) => void
            fullscreen?: boolean
            onToggleFullscreen?: () => void
        },
    ) => {
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
            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    ...(fullscreen ? { flex: 1, minHeight: 0 } : { height: '60rem' }),
                }}
            >
                <iframe
                    ref={iframeRef}
                    src={SRC}
                    title='Excalidraw'
                    style={{
                        width: '100%',
                        height: '100%',
                        border: 'none',
                        borderRadius: fullscreen ? 0 : '0.8rem',
                        display: 'block',
                        backgroundColor: '#161718',
                    }}
                />
                {onToggleFullscreen && (
                    <Button
                        radius='3.2rem'
                        title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                        onClick={onToggleFullscreen}
                        tabIndex={-1}
                        sx={{
                            position: 'absolute',
                            top: '0.8rem',
                            right: '0.8rem',
                            zIndex: 2,
                            backgroundColor: tc.surfaceRaised,
                            boxShadow: tc.shadowPopover,
                        }}
                    >
                        {fullscreen ? <ArrowsInSimple size={18} /> : <ArrowsOutSimple size={18} />}
                    </Button>
                )}
            </div>
        )
    },
    (prev, next) => prev.fullscreen === next.fullscreen,
)
