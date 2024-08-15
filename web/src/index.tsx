import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Toast from './Toast'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Toast />
    <App />
  </StrictMode>
)