import apiClient from '../../../shared/lib/axios.js'
import { supabase } from '../../../shared/lib/supabaseClient.js'
import { isSupabase } from '../../../shared/lib/crudAdapter.js'
import { stockOut } from '../../inventory/services/inventoryService.js'
import { createTransaction } from '../../finance/services/transactionService.js'

// ─── Checkout ────────────────────────────────────────────────────────────────
export async function processCheckout({ receiptNo, items, subtotal, discount, total, paymentMethod, amountPaid, change, customerId, customerName, notes, cashierId, cashierName, shiftId, pointsEarned, pointsRedeemed }) {
  const now = new Date().toISOString()

  // 1. Reduce stock for each item
  for (const item of items) {
    await stockOut({ product_id: item.product_id, quantity: item.qty, notes: `POS Sale ${receiptNo}`, reference: receiptNo })
  }

  // 2. Record finance transaction
  const txn = await createTransaction({
    type: 'income', amount: total, category: 'Penjualan POS',
    description: `Penjualan POS ${receiptNo}`, reference: receiptNo,
    payment_method: paymentMethod, status: 'paid',
    contact_name: customerName || '', date: now.slice(0, 10), notes: notes || '',
  })

  // 3. Save sale record
  const saleData = {
    receipt_no: receiptNo, cashier_id: cashierId || '', cashier_name: cashierName || '',
    shift_id: shiftId || '', customer_id: customerId || '', customer_name: customerName || '',
    subtotal, discount, total, payment_method: paymentMethod,
    amount_paid: amountPaid, change_amount: change,
    points_earned: pointsEarned || 0, points_redeemed: pointsRedeemed || 0,
    notes: notes || '', transaction_id: txn?.id || '',
    created_at: now,
  }

  if (isSupabase()) {
    const { data: sale, error: saleErr } = await supabase.from('pos_sales').insert(saleData).select().single()
    if (saleErr) throw new Error(saleErr.message)

    // Save sale items
    const saleItems = items.map(item => ({
      sale_id: sale.id, product_id: item.product_id, product_name: item.name,
      product_sku: item.sku || '', qty: item.qty, price: item.price,
      discount_type: item.discount_type, discount_value: item.discount_value || 0,
      subtotal: item.price * item.qty, total: item.price * item.qty - (item.discount_type === 'percent' ? item.price * item.qty * (item.discount_value / 100) : (item.discount_value || 0)),
      unit: item.unit || 'pcs',
    }))
    const { error: itemsErr } = await supabase.from('pos_sale_items').insert(saleItems)
    if (itemsErr) throw new Error(itemsErr.message)
    return { ...sale, items: saleItems }
  } else {
    const r = await apiClient.post('', { action: 'pos.checkout', payload: { sale: saleData, items } })
    return r.data.data
  }
}

// ─── Sales History ────────────────────────────────────────────────────────────
export async function fetchSales({ dateFrom, dateTo, cashierId, limit = 100 } = {}) {
  if (isSupabase()) {
    let q = supabase.from('pos_sales').select('*').order('created_at', { ascending: false }).limit(limit)
    if (dateFrom) q = q.gte('created_at', dateFrom + 'T00:00:00')
    if (dateTo)   q = q.lte('created_at', dateTo   + 'T23:59:59')
    if (cashierId) q = q.eq('cashier_id', cashierId)
    const { data, error } = await q
    if (error) throw new Error(error.message)
    return data || []
  }
  return (await apiClient.post('', { action: 'pos.getSales', payload: { dateFrom, dateTo, cashierId } })).data.data
}

export async function fetchSaleById(id) {
  if (isSupabase()) {
    const { data: sale, error } = await supabase.from('pos_sales').select('*').eq('id', id).single()
    if (error) throw new Error(error.message)
    const { data: items } = await supabase.from('pos_sale_items').select('*').eq('sale_id', id)
    return { ...sale, items: items || [] }
  }
  return (await apiClient.post('', { action: 'pos.getSale', payload: { id } })).data.data
}

export async function processSaleRefund(saleId) {
  if (isSupabase()) {
    const sale = await fetchSaleById(saleId)
    if (!sale) throw new Error('Sale not found')
    if (sale.is_refunded) throw new Error('Sale already refunded')

    // Return stock
    for (const item of sale.items || []) {
      const { error } = await supabase.from('inventory').select('*').eq('product_id', item.product_id).single()
        .then(async ({ data: inv }) => {
          if (!inv) return { error: null }
          const newQty = (parseFloat(inv.quantity) || 0) + (parseFloat(item.qty) || 0)
          return supabase.from('inventory').update({ quantity: newQty, updated_at: new Date().toISOString() }).eq('product_id', item.product_id)
        })
      if (error) throw new Error(error.message)
      await supabase.from('stock_movements').insert({ product_id: item.product_id, type: 'in', quantity: item.qty, reference: sale.receipt_no, notes: `Refund ${sale.receipt_no}` })
    }

    // Mark as refunded
    await supabase.from('pos_sales').update({ is_refunded: true, refunded_at: new Date().toISOString() }).eq('id', saleId)

    // Record refund finance entry
    await createTransaction({ type: 'expense', amount: sale.total, category: 'Refund POS', description: `Refund ${sale.receipt_no}`, reference: sale.receipt_no, payment_method: sale.payment_method, status: 'paid', date: new Date().toISOString().slice(0, 10) })
    return { ok: true }
  }
  return (await apiClient.post('', { action: 'pos.refund', payload: { sale_id: saleId } })).data.data
}

// ─── Loyalty ──────────────────────────────────────────────────────────────────
export async function fetchLoyaltyByCustomer(customerId) {
  if (isSupabase()) {
    const { data, error } = await supabase.from('pos_loyalty').select('*').eq('customer_id', customerId).maybeSingle()
    if (error) throw new Error(error.message)
    return data
  }
  return (await apiClient.post('', { action: 'pos.getLoyalty', payload: { customer_id: customerId } })).data.data
}

export async function updateLoyaltyPoints(customerId, pointsEarned, pointsRedeemed = 0) {
  if (isSupabase()) {
    const existing = await fetchLoyaltyByCustomer(customerId)
    const now = new Date().toISOString()
    if (existing) {
      const newPoints = (parseFloat(existing.points) || 0) + pointsEarned - pointsRedeemed
      const { error } = await supabase.from('pos_loyalty').update({ points: Math.max(0, newPoints), updated_at: now, total_earned: (existing.total_earned || 0) + pointsEarned }).eq('customer_id', customerId)
      if (error) throw new Error(error.message)
    } else {
      const { error } = await supabase.from('pos_loyalty').insert({ customer_id: customerId, points: Math.max(0, pointsEarned - pointsRedeemed), total_earned: pointsEarned, created_at: now, updated_at: now })
      if (error) throw new Error(error.message)
    }
  }
}

// ─── POS Summary ─────────────────────────────────────────────────────────────
export async function fetchPosSummary(date) {
  const today = date || new Date().toISOString().slice(0, 10)
  if (isSupabase()) {
    const { data, error } = await supabase.from('pos_sales').select('*').gte('created_at', today + 'T00:00:00').lte('created_at', today + 'T23:59:59').eq('is_refunded', false)
    if (error) throw new Error(error.message)
    const sales = data || []
    const total = sales.reduce((s, t) => s + (parseFloat(t.total) || 0), 0)
    const byMethod = {}
    sales.forEach(s => { const m = s.payment_method || 'cash'; byMethod[m] = (byMethod[m] || 0) + (parseFloat(s.total) || 0) })
    return { date: today, total_sales: total, total_transactions: sales.length, by_payment_method: byMethod }
  }
  return (await apiClient.post('', { action: 'pos.getSummary', payload: { date: today } })).data.data
}
