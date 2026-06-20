import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './manifest.json'

export default defineConfig({
    plugins: [react(), crx({ manifest })],
    resolve: { dedupe: ['react', 'react-dom'] },
    build: {
        rollupOptions: {
            input: {
                welcome: 'pages/iframe.html',
                excalidraw: 'pages/excalidraw.html',
            },
        },
    },
})
