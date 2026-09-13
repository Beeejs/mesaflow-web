import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider } from 'react-router'
import { Toaster } from 'sonner'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
/* css */
import './globals.css'
/* router */
import router from './router.jsx'
/* Api */
import queryClient from './api/queryClient'
/* Context */
import { SessionProvider } from './context/SessionContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
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

          <ReactQueryDevtools initialIsOpen={false} />
        </SessionProvider>
      </QueryClientProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
)
