import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'
import { logoutFromServer } from '../services/authService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useSession() {
  const { user, token, isAuthenticated } = useAuthStore()
  const clearSession = useAuthStore(s => s.clearSession)
  const navigate = useNavigate()
  const toast    = useToast()
  const logout = useCallback(async () => {
    try { if (token) await logoutFromServer(token) } catch (_) {}
    finally { clearSession(); navigate('/login', { replace: true }); toast.info('Anda telah keluar') }
  }, [token, clearSession, navigate, toast])
  return { user, token, isAuthenticated, logout }
}
