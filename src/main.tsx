import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './components/App/App.tsx'

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
