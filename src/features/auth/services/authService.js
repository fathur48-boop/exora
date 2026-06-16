import apiClient from '../../../shared/lib/axios.js'
import { supabase } from '../../../shared/lib/supabaseClient.js'
import { getActiveBackend, BACKENDS } from '../../../shared/lib/backendStore.js'

async function getProfile(userId) {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single()
  if (error) throw new Error(error.message)
  return data
}

export async function loginWithCredentials({ email, password }) {
  if (getActiveBackend() === BACKENDS.SUPABASE) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw new Error(error.message)
    const profile = await getProfile(data.user.id)
    if (profile.is_active === false) throw new Error('Akun ini tidak aktif')
    return {
      token: data.session.access_token,
      user: {
        id: data.user.id, email: data.user.email,
        full_name: profile.full_name, role: profile.role,
        avatar_url: profile.avatar_url || '',
      },
    }
  }
  const r = await apiClient.post('', { action: 'auth.login', payload: { email, password } })
  return r.data.data
}

export async function validateSession(token) {
  if (getActiveBackend() === BACKENDS.SUPABASE) {
    const { data, error } = await supabase.auth.getSession()
    if (error || !data.session) throw new Error('Session expired or invalid')
    const profile = await getProfile(data.session.user.id)
    return {
      user: {
        id: data.session.user.id, email: data.session.user.email,
        full_name: profile.full_name, role: profile.role,
        avatar_url: profile.avatar_url || '',
      },
    }
  }
  const r = await apiClient.post('', { action: 'auth.validateSession', payload: { token } })
  return r.data.data
}

export async function logoutFromServer(token) {
  if (getActiveBackend() === BACKENDS.SUPABASE) {
    await supabase.auth.signOut()
    return
  }
  await apiClient.post('', { action: 'auth.logout', payload: { token } })
}

/**
 * Register a new user (Supabase only). For GAS, user creation goes through
 * Settings -> User Management (settings.createUser), which remains unchanged.
 */
export async function registerWithCredentials({ email, password, full_name, role = 'staff' }) {
  if (getActiveBackend() !== BACKENDS.SUPABASE) {
    throw new Error('Registrasi langsung hanya tersedia pada mode Supabase')
  }
  const { data, error } = await supabase.auth.signUp({
    email, password,
    options: { data: { full_name, role } },
  })
  if (error) throw new Error(error.message)
  return data
}
