import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './components/App/App.tsx'

// the card drawing preview runs excalidraw's exportToSvg in this realm; 
// so this would point its font loading at the bundled /fonts dir (since cdn font is blocked by browser). 
// fonts copied from @excalidraw/excalidraw.
;(globalThis as unknown as { EXCALIDRAW_ASSET_PATH: string }).EXCALIDRAW_ASSET_PATH = '/'

const buildRoot = () => {
    const root = document.createElement('div')
    root.id = 'crx-root'
    document.body.appendChild(root)
    return root
}

const root = buildRoot()

createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
