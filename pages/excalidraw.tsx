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
}

const toggleNativeFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else document.documentElement.requestFullscreen()
}

const FullscreenButton = ({ fullscreen }: { fullscreen: boolean }) => (
    <button
        type='button'
        className='ToolIcon_type_button ToolIcon_size_medium'
        title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        onClick={toggleNativeFullscreen}
        style={{
            width: 36,
            height: 36,
            display: 'grid',
            placeItems: 'center',
            border: 'none',
            borderRadius: 'var(--border-radius-lg, 8px)',
            background: 'var(--island-bg-color)',
            color: 'var(--text-primary-color)',
            cursor: 'pointer',
        }}
    >
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
            <path d={fullscreen ? ICON.exit : ICON.enter} />
        </svg>
    </button>
)

const App = () => {
    const [scene, setScene] = useState<Scene | null>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    // excalidraw's onChange fires for non-edits too (load, selection, scroll).
    // track the scene version so we only notify the parent on real element mutations
    // keeps its dirty flag honest.
    const versionRef = useRef<number | null>(null)
    const previewTimer = useRef<NodeJS.Timeout | undefined>(undefined)

    // deno-lint-ignore no-explicit-any
    const excalidrawRef = useRef<any>(null)

    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if (e.data?.type !== 'excalidraw:init') return

            // deno-lint-ignore no-explicit-any
            versionRef.current = getSceneVersion(e.data.data.elements as any)
            setScene(e.data.data)
        }

        const onContextMenu = (e: Event) => e.preventDefault() // (excalidraw shows its own right click menu)

        const onFullscreen = () => {
            setIsFullscreen(!!document.fullscreenElement)
            setTimeout(() => excalidrawRef.current?.scrollToContent(undefined), 10)
        }

        globalThis.addEventListener('message', onMessage)
        globalThis.addEventListener('contextmenu', onContextMenu)
        document.addEventListener('fullscreenchange', onFullscreen)
        post({ type: 'excalidraw:ready' })

        return () => {
            globalThis.removeEventListener('message', onMessage)
            globalThis.removeEventListener('contextmenu', onContextMenu)
            document.removeEventListener('fullscreenchange', onFullscreen)
        }
    }, [])

    if (!scene) return null

    return (
        <Excalidraw
            theme='dark'
            autoFocus
            renderTopRightUI={() => <FullscreenButton fullscreen={isFullscreen} />}
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
                if (version === versionRef.current) return

                versionRef.current = version
                post({ type: 'excalidraw:change', data: { elements: [...elements], files: { ...files } } })

                // regenerate the thumbnail after the user pauses (export is expensive 😠)
                clearTimeout(previewTimer.current)
                previewTimer.current = setTimeout(() => postPreview(elements, files), 500)
            }}
        />
    )
}

createRoot(document.getElementById('root')!).render(<App />)
