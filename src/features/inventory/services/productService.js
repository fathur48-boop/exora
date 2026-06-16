import apiClient from '../../../shared/lib/axios.js'
import { supabase } from '../../../shared/lib/supabaseClient.js'
import { isSupabase } from '../../../shared/lib/crudAdapter.js'

export async function fetchProducts() {
  if (isSupabase()) {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }
  return (await apiClient.post('', { action: 'inventory.getProducts', payload: {} })).data.data
}

export async function fetchProductById(id) {
  if (isSupabase()) {
    const { data: product, error } = await supabase.from('products').select('*').eq('id', id).single()
    if (error) throw new Error(error.message)
    const { data: inv } = await supabase.from('inventory').select('*').eq('product_id', id).single()
    return { ...product, quantity: inv?.quantity ?? 0, min_stock: inv?.min_stock ?? 0, location: inv?.location ?? '' }
  }
  return (await apiClient.post('', { action: 'inventory.getProduct', payload: { id } })).data.data
}

export async function createProduct(data) {
  if (isSupabase()) {
    const row = {
      name: data.name, sku: data.sku || null, category: data.category || '',
      description: data.description || '', price: Number(data.price) || 0,
      cost: Number(data.cost) || 0, unit: data.unit || 'pcs',
      is_active: data.is_active !== undefined ? data.is_active : true,
    }
    const { data: created, error } = await supabase.from('products').insert(row).select().single()
    if (error) throw new Error(error.message)
    return created
  }
  return (await apiClient.post('', { action: 'inventory.createProduct', payload: data })).data.data
}

export async function updateProduct(id, data) {
  if (isSupabase()) {
    const row = {
      name: data.name, sku: data.sku, category: data.category, description: data.description,
      price: data.price !== undefined ? Number(data.price) || 0 : undefined,
      cost: data.cost !== undefined ? Number(data.cost) || 0 : undefined,
      unit: data.unit, is_active: data.is_active, updated_at: new Date().toISOString(),
    }
    Object.keys(row).forEach(k => row[k] === undefined && delete row[k])
    const { data: updated, error } = await supabase.from('products').update(row).eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return updated
  }
  return (await apiClient.post('', { action: 'inventory.updateProduct', payload: { id, ...data } })).data.data
}

export async function deleteProduct(id) {
  if (isSupabase()) {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return { ok: true }
  }
  return (await apiClient.post('', { action: 'inventory.deleteProduct', payload: { id } })).data.data
}

export async function bulkCreateProducts(rows) {
  const results = []
  for (const row of rows) {
    try {
      const created = await createProduct(row)
      results.push({ ok: true, row: created })
    } catch (e) {
      results.push({ ok: false, error: e.message, row })
    }
  }
  return results
}
