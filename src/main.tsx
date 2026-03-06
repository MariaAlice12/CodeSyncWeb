import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Home from './pages/Home'
import CreateTraining from './pages/CreateTraining'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CreateTraining />
  </StrictMode>,
)
