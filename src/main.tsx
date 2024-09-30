import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './components/App'
import './index.css'

// this is for non-extesion main page
ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App isExtension={false} />
    </React.StrictMode>
)
