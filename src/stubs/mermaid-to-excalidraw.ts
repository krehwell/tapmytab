// Stub for @excalidraw/mermaid-to-excalidraw (aliased in vite.config.ts).
// Excalidraw lazy-imports this ONLY for its "Mermaid → Excalidraw" paste feature, which we don't
// use. Replacing it drops mermaid + katex + cytoscape (~2.5MB) from the build. The function only
// runs if someone triggers that feature; throwing there is fine.
export const parseMermaidToExcalidraw = () => {
    throw new Error('mermaid-to-excalidraw is disabled to keep the extension small')
}
