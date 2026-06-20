import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { fileURLToPath } from 'node:url'
import manifest from './manifest.json'

export default defineConfig({
    plugins: [react(), crx({ manifest })],
    resolve: {
        dedupe: ['react', 'react-dom'],
        alias: {
            // drop excalidraw's mermaid feature (mermaid + katex + cytoscape, ~2.5MB) — see the stub
            '@excalidraw/mermaid-to-excalidraw': fileURLToPath(
                new URL('./src/stubs/mermaid-to-excalidraw.ts', import.meta.url),
            ),
        },
    },
    build: {
        rollupOptions: {
            input: {
                welcome: 'pages/iframe.html',
                excalidraw: 'pages/excalidraw.html',
            },
        },
    },
})
