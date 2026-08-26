// src/components/common/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'cliente'
}

export function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRole && user?.user_type !== requiredRole) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}