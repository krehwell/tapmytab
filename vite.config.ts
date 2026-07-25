import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import { fileURLToPath } from 'node:url'
import manifest from './manifest.json'

// mode 'web' builds the app as a plain static site (landing page live demo),
// default mode builds the browser extension via crx
export default defineConfig(({ mode }) => {
    const isWeb = mode === 'web'
    return {
        base: isWeb ? './' : '/',
        plugins: isWeb ? [react()] : [react(), crx({ manifest })],
        resolve: {
            dedupe: ['react', 'react-dom'],
            alias: {
                // drop excalidraw's mermaid feature (mermaid + katex + cytoscape, ~2.5MB) (checkout ./src/stubs/)
                '@excalidraw/mermaid-to-excalidraw': fileURLToPath(
                    new URL('./src/stubs/mermaid-to-excalidraw.ts', import.meta.url),
                ),
            },
        },
        build: {
            ...(isWeb && { outDir: 'landing/app', emptyOutDir: true }),
            rollupOptions: {
                input: {
                    ...(isWeb && { main: 'index.html' }),
                    excalidraw: 'pages/excalidraw.html',
                },
            },
        },
    }
})
