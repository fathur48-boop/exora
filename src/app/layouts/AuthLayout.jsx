import { Outlet, Navigate } from 'react-router-dom'
import { useAuthStore } from '../../features/auth/store/authStore.js'

export default function AuthLayout() {
  const isAuthenticated = useAuthStore(s => s.isAuthenticated)
  if (isAuthenticated) return <Navigate to="/dashboard" replace />

  return (
    <div className="auth-bg min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md relative z-10">
        <Outlet />
      </div>
    </div>
  )
}
