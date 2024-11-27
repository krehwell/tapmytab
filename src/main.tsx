import React from 'react'
import ReactDOM from 'react-dom';
import './index.css'
import { App } from './components/App/App.tsx'

const buildRoot = () => {
    const root = document.createElement('div')
    root.id = 'crx-root'
    document.body.appendChild(root)
    return root
}

const root = buildRoot()

ReactDOM.createRoot(root).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
)
