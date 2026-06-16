import apiClient from './axios.js'
import { supabase } from './supabaseClient.js'
import { getActiveBackend, BACKENDS } from './backendStore.js'

/**
 * Generic CRUD adapter factory.
 * Produces { getAll, getById, create, update, remove } that route to
 * either GAS (axios → Apps Script Router) or Supabase (postgrest) based
 * on the active backend toggle (Settings → Backend).
 *
 * @param {object} config
 * @param {string} config.table       - Supabase table name
 * @param {object} config.gas         - GAS action names: { getAll, getById, create, update, remove }
 * @param {object} [config.order]     - Default order for getAll: { column, ascending }
 * @param {function} [config.fromRow] - Optional transform: supabase row -> app shape
 * @param {function} [config.toRow]   - Optional transform: app data -> supabase row
 */
export function createCrudAdapter({ table, gas, order = { column: 'created_at', ascending: false }, fromRow, toRow }) {
  const map = (row) => (fromRow ? fromRow(row) : row)
  const unmap = (data) => (toRow ? toRow(data) : data)

  async function getAll(filters = {}) {
    if (getActiveBackend() === BACKENDS.SUPABASE) {
      let query = supabase.from(table).select('*').limit(10000)
      Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== null && v !== '') query = query.eq(k, v) })
      if (order?.column) query = query.order(order.column, { ascending: !!order.ascending })
      const { data, error } = await query
      if (error) throw new Error(error.message)
      return (data || []).map(map)
    }
    const r = await apiClient.post('', { action: gas.getAll, payload: filters })
    return r.data.data
  }

  async function getById(id) {
    if (getActiveBackend() === BACKENDS.SUPABASE) {
      const { data, error } = await supabase.from(table).select('*').eq('id', id).single()
      if (error) throw new Error(error.message)
      return map(data)
    }
    const r = await apiClient.post('', { action: gas.getById, payload: { id } })
    return r.data.data
  }

  async function create(payload) {
    if (getActiveBackend() === BACKENDS.SUPABASE) {
      const row = unmap(payload)
      const { data, error } = await supabase.from(table).insert(row).select().single()
      if (error) throw new Error(error.message)
      return map(data)
    }
    const r = await apiClient.post('', { action: gas.create, payload })
    return r.data.data
  }

  async function update(id, payload) {
    if (getActiveBackend() === BACKENDS.SUPABASE) {
      const row = unmap(payload)
      const { data, error } = await supabase.from(table).update(row).eq('id', id).select().single()
      if (error) throw new Error(error.message)
      return map(data)
    }
    const r = await apiClient.post('', { action: gas.update, payload: { id, ...payload } })
    return r.data.data
  }

  async function remove(id) {
    if (getActiveBackend() === BACKENDS.SUPABASE) {
      const { error } = await supabase.from(table).delete().eq('id', id)
      if (error) throw new Error(error.message)
      return { ok: true }
    }
    const r = await apiClient.post('', { action: gas.remove, payload: { id } })
    return r.data.data
  }

  async function bulkCreate(rows) {
    const results = []
    for (const row of rows) {
      try {
        const created = await create(row)
        results.push({ ok: true, row: created })
      } catch (e) {
        results.push({ ok: false, error: e.message, row })
      }
    }
    return results
  }

  return { getAll, getById, create, update, remove, bulkCreate }
}

/**
 * Helper to call a custom GAS action OR a Supabase RPC / query function,
 * for endpoints that don't fit plain CRUD (summaries, reports, stock ops, etc).
 *
 * @param {object} config
 * @param {string} config.gasAction     - GAS action name
 * @param {function} config.supabaseFn  - async (payload) => result, executed when backend === supabase
 */
export async function callCustom({ gasAction, supabaseFn, payload = {} }) {
  if (getActiveBackend() === BACKENDS.SUPABASE) {
    return supabaseFn(payload)
  }
  const r = await apiClient.post('', { action: gasAction, payload })
  return r.data.data
}

export function isSupabase() {
  return getActiveBackend() === BACKENDS.SUPABASE
}
