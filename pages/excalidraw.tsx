// listeners bind to this window (so pointer mapping is exact).
// scene data is exchanged with the parent over postMessage.
// fonts come from the extension root.
// deno-lint-ignore no-explicit-any
;(globalThis as any).EXCALIDRAW_ASSET_PATH = '/'

import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Excalidraw, exportToSvg, getSceneVersion } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css'
type Scene = { elements: readonly unknown[]; files: Record<string, unknown> }

const post = (message: unknown) => globalThis.parent?.postMessage(message, '*')

// generate an <svg> snapshot here (where excalidraw + fonts are loaded) and ship the markup to the
// parent, so the card can show a thumbnail WITHOUT loading excalidraw in the main app.
const postPreview = async (elements: readonly unknown[], files: Record<string, unknown>) => {
    const svg = await exportToSvg({
        // deno-lint-ignore no-explicit-any
        elements: elements as any,
        // deno-lint-ignore no-explicit-any
        files: files as any,
        appState: { exportBackground: false, exportWithDarkMode: true },
        skipInliningFonts: true, // main app provides Excalifont via its own @font-face
    })
    post({ type: 'excalidraw:preview', preview: svg.outerHTML })
}

const ICON = {
    enter: 'M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3',
    exit: 'M8 3v3a2 2 0 0 1-2 2H3M21 8h-3a2 2 0 0 1-2-2V3M3 16h3a2 2 0 0 1 2 2v3M16 21v-3a2 2 0 0 1 2-2h3',
    save: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2zM17 21v-8H7v8M7 3v5h8',
    close: 'M18 6 6 18M6 6l12 12',
}

const ToolButton = (
    { title, icon, label, onClick }: { title: string; icon?: string; label?: string; onClick: () => void },
) => (
    <button
        type='button'
        className='ToolIcon_type_button ToolIcon_size_medium'
        title={title}
        onClick={onClick}
        style={{
            width: label ? 'auto' : 36,
            height: 36,
            padding: label ? '0 12px' : 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            border: 'none',
            borderRadius: 'var(--border-radius-lg, 8px)',
            background: 'var(--island-bg-color)',
            color: 'var(--text-primary-color)',
            fontFamily: 'Excalifont',
            fontSize: 16,
        }}
    >
        {icon && (
            <svg
                width='16'
                height='16'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
            >
                <path d={icon} />
            </svg>
        )}
        {label}
    </button>
)

const App = () => {
    const [scene, setScene] = useState<Scene | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [isDirty, setIsDirty] = useState(false)

    // excalidraw's onChange fires for non-edits too (load, selection, scroll).
    // track the scene version so we only notify the parent on real element mutations
    const versionRef = useRef<number | null>(null)
    const previewTimer = useRef<NodeJS.Timeout | undefined>(undefined)

    // deno-lint-ignore no-explicit-any
    const excalidrawRef = useRef<any>(null)

    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if (e.data?.type !== 'excalidraw:init') return
            setScene(e.data.data)
        }

        const onContextMenu = (e: Event) => e.preventDefault() // (excalidraw shows its own right click menu)

        // parent resizes the iframe on fullscreen toggle; refit the scene once it has resized.
        const onResize = () => setTimeout(() => excalidrawRef.current?.scrollToContent(undefined), 10)

        globalThis.addEventListener('message', onMessage)
        globalThis.addEventListener('contextmenu', onContextMenu)
        globalThis.addEventListener('resize', onResize)
        post({ type: 'excalidraw:ready' })

        return () => {
            globalThis.removeEventListener('message', onMessage)
            globalThis.removeEventListener('contextmenu', onContextMenu)
            globalThis.removeEventListener('resize', onResize)
        }
    }, [])

    // fullscreen is CSS-driven by the parent (so Esc can't exit it like the native API).
    const toggleFullscreen = () => {
        setIsFullscreen((f) => {
            post({ type: 'excalidraw:fullscreen', value: !f })
            return !f
        })
    }

    if (!scene) return null

    return (
        <Excalidraw
            theme='dark'
            autoFocus
            renderTopRightUI={() => (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isFullscreen && (isDirty
                        ? (
                            <ToolButton
                                title='Save'
                                icon={ICON.save}
                                label='Save'
                                onClick={() => {
                                    post({ type: 'excalidraw:save' })
                                    setIsDirty(false)
                                }}
                            />
                        )
                        : (
                            <ToolButton
                                title='Exit'
                                icon={ICON.close}
                                label='Exit'
                                onClick={() => post({ type: 'excalidraw:exit' })}
                            />
                        ))}
                    <ToolButton
                        title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
                        icon={isFullscreen ? ICON.exit : ICON.enter}
                        onClick={toggleFullscreen}
                    />
                </div>
            )}
            excalidrawAPI={(api) => {
                excalidrawRef.current = api

                // you might be thinking this is dumb, but this is to fix stuttering looks when the excalidraw is opened
                document.body.style.opacity = '0'
                setTimeout(() => api.scrollToContent(undefined, { fitToContent: true }), 10)
                setTimeout(() => document.body.style.opacity = '1', 35)
            }}
            initialData={{
                // deno-lint-ignore no-explicit-any
                elements: scene.elements as any,
                // deno-lint-ignore no-explicit-any
                files: scene.files as any,
                appState: { viewBackgroundColor: 'transparent' },
            }}
            onChange={(elements, _appState, files) => {
                const version = getSceneVersion(elements)

                if (versionRef.current === null) {
                    versionRef.current = version
                    return
                }
                if (version === versionRef.current) return

                versionRef.current = version
                setIsDirty(true)

                const live = elements.filter((el) => !el.isDeleted)
                post({ type: 'excalidraw:change', data: { elements: live, files: { ...files } } })

                // regenerate the thumbnail after the user pauses (export is expensive 😠)
                clearTimeout(previewTimer.current)
                previewTimer.current = setTimeout(() => postPreview(live, files), 500)
            }}
        />
    )
}

createRoot(document.getElementById('root')!).render(<App />)
