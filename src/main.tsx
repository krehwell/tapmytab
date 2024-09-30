import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import './silicon.min.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App isExtension={false} />
    </React.StrictMode>
)
