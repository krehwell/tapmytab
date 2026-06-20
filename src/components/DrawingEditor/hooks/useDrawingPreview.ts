import { RefObject, useEffect, useRef } from 'react'
import { TExcalidraw } from '../../../types.ts'
import '../excalifont.css'

// renders a static svg snapshot of the excalidraw drawing into the returned ref's element.
export const useDrawingPreview = (content: TExcalidraw): RefObject<HTMLDivElement> => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!content.elements.length) return
        let cancelled = false

        // excalidraw is imported lazily so its heavy chunk doesn't bloat the new-tab's initial load.
        import('@excalidraw/excalidraw')
            .then(({ exportToSvg }) =>
                exportToSvg({
                    // deno-lint-ignore no-explicit-any
                    elements: content.elements as any,
                    // deno-lint-ignore no-explicit-any
                    files: content.files as any,
                    appState: { exportBackground: false, exportWithDarkMode: true },
                    skipInliningFonts: true,
                })
            )
            .then((svg) => {
                if (cancelled || !ref.current) return
                // svg keeps its viewBox + preserveAspectRatio, so 100%/100% fits without distortion
                svg.style.width = '100%'
                svg.style.height = '100%'
                svg.style.display = 'block'
                ref.current.replaceChildren(svg)
            })

        return () => {
            cancelled = true
        }
    }, [content])

    return ref
}
