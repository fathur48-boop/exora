import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../../../features/auth/store/authStore.js'
import Spinner from '../ui/Spinner.jsx'

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user, isHydrated } = useAuthStore()
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-muted">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 bg-brand-600 rounded-xl flex items-center justify-center">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
            </svg>
          </div>
          <Spinner size="md" className="text-brand-500" />
        </div>
      </div>
    )
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
