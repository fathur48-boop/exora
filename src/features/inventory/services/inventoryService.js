import apiClient from '../../../shared/lib/axios.js'
import { supabase } from '../../../shared/lib/supabaseClient.js'
import { isSupabase } from '../../../shared/lib/crudAdapter.js'

function mapInventoryRow(row) {
  const p = row.products || {}
  return {
    product_id: row.product_id,
    quantity: row.quantity,
    min_stock: row.min_stock,
    location: row.location,
    updated_at: row.updated_at,
    product_name: p.name || '',
    product_sku: p.sku || '',
    product_category: p.category || '',
    product_description: p.description || '',
    product_price: p.price || 0,
    product_cost: p.cost || 0,
    product_unit: p.unit || 'pcs',
    product_active: p.is_active,
  }
}

export async function fetchInventory() {
  if (isSupabase()) {
    const { data, error } = await supabase.from('inventory').select('*, products(*)')
    if (error) throw new Error(error.message)
    return data.map(mapInventoryRow)
  }
  return (await apiClient.post('', { action: 'inventory.getInventory', payload: {} })).data.data
}

export async function fetchLowStock() {
  if (isSupabase()) {
    const all = await fetchInventory()
    return all.filter(i => {
      const qty = parseFloat(i.quantity) || 0
      const min = parseFloat(i.min_stock) || 0
      return min > 0 && qty <= min
    })
  }
  return (await apiClient.post('', { action: 'inventory.getLowStock', payload: {} })).data.data
}

async function getInventoryRow(productId) {
  const { data, error } = await supabase.from('inventory').select('*').eq('product_id', productId).single()
  if (error) throw new Error(error.message)
  return data
}

async function recordMovement(productId, type, quantity, notes, reference) {
  const { error } = await supabase.from('stock_movements').insert({
    product_id: productId, type, quantity, reference: reference || '', notes: notes || '',
  })
  if (error) throw new Error(error.message)
}

async function getWithProduct(productId) {
  const { data: inv, error } = await supabase.from('inventory').select('*, products(*)').eq('product_id', productId).single()
  if (error) throw new Error(error.message)
  return mapInventoryRow(inv)
}

export async function stockIn(data) {
  if (isSupabase()) {
    const inv = await getInventoryRow(data.product_id)
    const newQty = (parseFloat(inv.quantity) || 0) + (parseFloat(data.quantity) || 0)
    const { error } = await supabase.from('inventory').update({ quantity: newQty, updated_at: new Date().toISOString() }).eq('product_id', data.product_id)
    if (error) throw new Error(error.message)
    await recordMovement(data.product_id, 'in', data.quantity, data.notes, data.reference)
    return getWithProduct(data.product_id)
  }
  return (await apiClient.post('', { action: 'inventory.stockIn', payload: data })).data.data
}

export async function stockOut(data) {
  if (isSupabase()) {
    const inv = await getInventoryRow(data.product_id)
    const current = parseFloat(inv.quantity) || 0
    const qty = parseFloat(data.quantity) || 0
    if (qty > current) throw new Error('Stok tidak cukup. Stok saat ini: ' + current)
    const { error } = await supabase.from('inventory').update({ quantity: current - qty, updated_at: new Date().toISOString() }).eq('product_id', data.product_id)
    if (error) throw new Error(error.message)
    await recordMovement(data.product_id, 'out', data.quantity, data.notes, data.reference)
    return getWithProduct(data.product_id)
  }
  return (await apiClient.post('', { action: 'inventory.stockOut', payload: data })).data.data
}

export async function adjustStock(data) {
  if (isSupabase()) {
    const newQty = parseFloat(data.quantity) || 0
    const { error } = await supabase.from('inventory').update({ quantity: newQty, updated_at: new Date().toISOString() }).eq('product_id', data.product_id)
    if (error) throw new Error(error.message)
    await recordMovement(data.product_id, 'adjustment', data.quantity, data.notes, '')
    return getWithProduct(data.product_id)
  }
  return (await apiClient.post('', { action: 'inventory.adjustStock', payload: data })).data.data
}

export async function updateMinStock(data) {
  if (isSupabase()) {
    const row = { updated_at: new Date().toISOString() }
    if (data.min_stock !== undefined) row.min_stock = parseFloat(data.min_stock) || 0
    if (data.location !== undefined) row.location = data.location
    const { error } = await supabase.from('inventory').update(row).eq('product_id', data.product_id)
    if (error) throw new Error(error.message)
    return getWithProduct(data.product_id)
  }
  return (await apiClient.post('', { action: 'inventory.updateMinStock', payload: data })).data.data
}

export async function fetchMovements(productId) {
  if (isSupabase()) {
    let query = supabase.from('stock_movements').select('*, products(name, sku)').order('created_at', { ascending: false })
    if (productId) query = query.eq('product_id', productId)
    const { data, error } = await query
    if (error) throw new Error(error.message)
    return data.map(m => ({
      ...m,
      product_name: m.products?.name || '',
      product_sku: m.products?.sku || '',
    }))
  }
  return (await apiClient.post('', { action: 'inventory.getMovements', payload: productId ? { product_id: productId } : {} })).data.data
}
