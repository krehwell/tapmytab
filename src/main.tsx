import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from './components/App'

const buildRoot = () => {
    const root = document.createElement('div')
    root.id = 'crx-root'
    document.body.appendChild(root)
    return root
}

const dumpIFrame = () => {
    const iframe = document.createElement('iframe')
    iframe.src = chrome.runtime.getURL('pages/iframe.html')
    iframe.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    width: 300px;
    height: 250px;
    border: none;
    z-index: 9999;
`
    document.body.appendChild(iframe)
}

// =========================================================================

const root = buildRoot()
// dumpIFrame()

// this is for extension main page
ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <App isExtension />
    </React.StrictMode>
)
