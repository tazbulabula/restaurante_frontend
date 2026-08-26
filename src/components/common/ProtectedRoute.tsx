// src/components/common/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Spinner } from '@/components/ui'

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'cliente'
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuthStore()

  // Mostra loading enquanto verifica
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  // Verifica se está autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  // Verifica role
  if (requiredRole && user?.user_type !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}