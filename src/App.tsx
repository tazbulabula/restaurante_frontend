// src/App.tsx

import { useEffect } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '@/store/authStore'
import { Spinner } from '@/components/ui'

function App() {

  const { checkAuth, isLoading } = useAuthStore()
  useEffect(() => {
    checkAuth()  // Verifica autenticação ao iniciar
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </>
  )
}

export default App