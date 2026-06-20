import { RefObject, useEffect, useRef } from 'react'
import { TExcalidraw } from '../../../types.ts'

// fits a preview <svg> into the box (it keeps its viewBox/preserveAspectRatio) and forces the
// hand-drawn font. await the font first — inline svg text won't re-render once a font loads late.
const mountSvg = async (host: HTMLDivElement, svg: SVGElement) => {
    await document.fonts.load('16px Excalifont').catch(() => {})
    svg.querySelectorAll('text').forEach((t) => (t.style.fontFamily = "'Excalifont', sans-serif"))
    svg.style.width = '100%'
    svg.style.height = '100%'
    svg.style.display = 'block'
    host.replaceChildren(svg)
}

// renders a static svg snapshot of the drawing into the returned ref's element.
export const useDrawingPreview = (content: TExcalidraw): RefObject<HTMLDivElement> => {
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!content.elements.length) return
        let cancelled = false

        // fast path: the editor cached the svg markup — render it with no excalidraw in the main app.
        if (content.preview) {
            const svg = new DOMParser().parseFromString(content.preview, 'image/svg+xml').documentElement
            if (ref.current) mountSvg(ref.current, svg as unknown as SVGElement)
            return
        }

        // fallback (cards never opened since previews existed): import excalidraw lazily to render once.
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
                mountSvg(ref.current, svg)
            })

        return () => {
            cancelled = true
        }
    }, [content])

    return ref
}
