import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
/* Context */
import { SessionProvider } from './context/SessionContext.jsx'
// TODO: Por ahora lo dejamos aca para que se vea globalmente pero no seria lo correcto.
import { Toaster } from 'sonner'
/* css */
import './globals.css'
/* router */
import router from './router.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SessionProvider>
      <RouterProvider router={router} />

      <Toaster
        richColors
        position="top-right"
        closeButton
        toastOptions={{
          style: {
            background: '#0B111C',
            color: '#F8FAFC',
            border: '1px solid #1F2937',
          },
        }}
      />
    </SessionProvider>

  </StrictMode>,
)
