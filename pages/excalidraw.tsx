import { useEffect, useRef, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Excalidraw, exportToSvg, getSceneVersion } from '@excalidraw/excalidraw'
import '@excalidraw/excalidraw/index.css' 

// listeners bind to this window (so pointer mapping is exact). 
// scene data is exchanged with the parent over postMessage.
// fonts come from the extension root.
// deno-lint-ignore no-explicit-any
;(globalThis as any).EXCALIDRAW_ASSET_PATH = '/'

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

const App = () => {
    const [scene, setScene] = useState<Scene | null>(null)

    // excalidraw's onChange fires for non-edits too (load, selection, scroll). 
    // track the scene version so we only notify the parent on real element mutations 
    // keeps its dirty flag honest.
    const versionRef = useRef<number | null>(null)
    const previewTimer = useRef<number | undefined>(undefined)

    useEffect(() => {
        const onMessage = (e: MessageEvent) => {
            if (e.data?.type !== 'excalidraw:init') return

            // deno-lint-ignore no-explicit-any
            versionRef.current = getSceneVersion(e.data.data.elements as any)
            setScene(e.data.data)
        }

        // suppress the browser's native right-click menu (excalidraw shows its own)
        const onContextMenu = (e: Event) => e.preventDefault()
        globalThis.addEventListener('message', onMessage)
        globalThis.addEventListener('contextmenu', onContextMenu)
        post({ type: 'excalidraw:ready' })

        return () => {
            globalThis.removeEventListener('message', onMessage)
            globalThis.removeEventListener('contextmenu', onContextMenu)
        }
    }, [])

    if (!scene) return null

    return (
        <Excalidraw
            theme='dark'
            initialData={{
                // deno-lint-ignore no-explicit-any
                elements: scene.elements as any,
                // deno-lint-ignore no-explicit-any
                files: scene.files as any,
                scrollToContent: true,
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
