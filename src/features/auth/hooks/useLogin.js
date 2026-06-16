import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore.js'
import { loginWithCredentials } from '../services/authService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError]         = useState(null)
  const setSession = useAuthStore(s => s.setSession)
  const navigate   = useNavigate()
  const toast      = useToast()
  const login = async ({ email, password }) => {
    setIsLoading(true); setError(null)
    try {
      const { user, token } = await loginWithCredentials({ email, password })
      setSession({ user, token })
      toast.success(`Selamat datang, ${user.full_name}!`)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      const msg = err.message || 'Login gagal. Coba lagi.'
      setError(msg); toast.error(msg)
    } finally { setIsLoading(false) }
  }
  return { login, isLoading, error }
}
