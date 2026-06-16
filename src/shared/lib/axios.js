import axios from 'axios'
import { useAuthStore } from '../../features/auth/store/authStore.js'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_GAS_BASE_URL,
  timeout: 20000,
  headers: { 'Content-Type': 'application/json' },
})

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token && config.data && typeof config.data === 'object') {
    config.data._token = token
  }
  return config
}, (error) => Promise.reject(error))

apiClient.interceptors.response.use(
  (response) => {
    if (response.data?.success === false) {
      return Promise.reject(new Error(response.data.message || 'Request failed'))
    }
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().clearSession()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient
