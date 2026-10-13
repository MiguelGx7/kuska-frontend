import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import '@fontsource/figtree/400.css'
import '@fontsource/figtree/500.css'
import '@fontsource/figtree/600.css'
import './styles/tokens.css'
import './styles/base.css'
import './styles/tabla.css'
import './styles/lista.css'
import './styles/detalle.css'

import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
