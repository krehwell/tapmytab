import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { App } from './components/App'

const root = document.createElement('div')
root.id = 'crx-root'
document.body.appendChild(root)

// this is for extension main page
ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <App isExtension />
    </React.StrictMode>
)
