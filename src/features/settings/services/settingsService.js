import apiClient from '../../../shared/lib/axios.js'
import { supabase } from '../../../shared/lib/supabaseClient.js'
import { isSupabase } from '../../../shared/lib/crudAdapter.js'

export async function fetchSettings() {
  if (isSupabase()) {
    const { data, error } = await supabase.from('settings').select('*')
    if (error) throw new Error(error.message)
    const result = {}
    data.forEach(row => { result[row.key] = row.value })
    return result
  }
  return (await apiClient.post('', { action: 'settings.getSettings', payload: {} })).data.data
}

export async function saveSettings(settings) {
  if (isSupabase()) {
    const rows = Object.entries(settings).map(([key, value]) => ({ key, value: String(value ?? ''), updated_at: new Date().toISOString() }))
    const { error } = await supabase.from('settings').upsert(rows, { onConflict: 'key' })
    if (error) throw new Error(error.message)
    return fetchSettings()
  }
  return (await apiClient.post('', { action: 'settings.updateSettings', payload: { settings } })).data.data
}

export async function fetchUsers() {
  if (isSupabase()) {
    const { data, error } = await supabase.from('profiles').select('id, email, full_name, role, is_active, created_at').order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }
  return (await apiClient.post('', { action: 'settings.getUsers', payload: {} })).data.data
}

export async function createUser(data) {
  if (isSupabase()) {
    throw new Error('Mode Supabase: buat user baru melalui Supabase Dashboard → Authentication → Users (Add user), lalu atur role-nya di tabel ini setelah muncul.')
  }
  return (await apiClient.post('', { action: 'settings.createUser', payload: data })).data.data
}

export async function updateUser(id, data) {
  if (isSupabase()) {
    if (data.password) throw new Error('Mode Supabase: reset password dilakukan melalui Supabase Dashboard → Authentication → Users.')
    const partial = { updated_at: new Date().toISOString() }
    if (data.full_name !== undefined) partial.full_name = data.full_name
    if (data.role !== undefined) partial.role = data.role
    if (data.is_active !== undefined) partial.is_active = data.is_active
    const { data: updated, error } = await supabase.from('profiles').update(partial).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return updated
  }
  return (await apiClient.post('', { action: 'settings.updateUser', payload: { id, ...data } })).data.data
}

export async function deleteUser(id) {
  if (isSupabase()) {
    const { error } = await supabase.from('profiles').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return { ok: true }
  }
  return (await apiClient.post('', { action: 'settings.deleteUser', payload: { id } })).data.data
}
