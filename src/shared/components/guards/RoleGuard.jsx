import { useAuthStore } from '../../../features/auth/store/authStore.js'
export default function RoleGuard({ roles, fallback = null, children }) {
  const userRole = useAuthStore(s => s.user?.role)
  if (!roles.includes(userRole)) return fallback
  return children
}
