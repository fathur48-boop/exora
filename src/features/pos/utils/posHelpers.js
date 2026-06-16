export const PAYMENT_METHODS = ['cash','transfer','card','qris']
export const PAYMENT_METHOD_LABELS = { cash:'Tunai', transfer:'Transfer', card:'Kartu', qris:'QRIS' }
export const DISCOUNT_TYPES = ['percent','nominal']

export function calcItemTotal(item) {
  const base = (item.price * item.qty)
  const disc = item.discount_type === 'percent'
    ? base * (item.discount_value / 100)
    : (item.discount_value || 0)
  return Math.max(0, base - disc)
}

export function calcCartSubtotal(items) {
  return items.reduce((s, item) => s + calcItemTotal(item), 0)
}

export function calcCartDiscount(items, cartDiscount, cartDiscountType, subtotal) {
  const itemDiscs = items.reduce((s, item) => {
    const base = item.price * item.qty
    const disc = item.discount_type === 'percent'
      ? base * (item.discount_value / 100)
      : (item.discount_value || 0)
    return s + disc
  }, 0)
  const cartDisc = cartDiscountType === 'percent'
    ? subtotal * ((cartDiscount || 0) / 100)
    : (cartDiscount || 0)
  return itemDiscs + cartDisc
}

export function calcCartTotal(items, cartDiscount, cartDiscountType) {
  const subtotal = calcCartSubtotal(items)
  const cartDisc = cartDiscountType === 'percent'
    ? subtotal * ((cartDiscount || 0) / 100)
    : (cartDiscount || 0)
  return Math.max(0, subtotal - cartDisc)
}

export function calcChange(total, paid) {
  return Math.max(0, (paid || 0) - total)
}

export function calcLoyaltyPoints(total, rate = 10000) {
  return Math.floor(total / rate)
}

export function formatReceiptDate(date) {
  return new Date(date).toLocaleString('id-ID', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export function generateReceiptNo() {
  const now = new Date()
  const y = now.getFullYear().toString().slice(-2)
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  const r = Math.floor(1000 + Math.random() * 9000)
  return `POS-${y}${m}${d}-${r}`
}

export function filterProducts(products, inventory, search, category, showAll) {
  return products.filter(p => {
    if (!showAll && !p.is_active) return false
    const inv = inventory.find(i => i.product_id === p.id)
    if (!showAll && inv && parseFloat(inv.quantity) <= 0) return false
    const q = (search || '').toLowerCase()
    const matchSearch = !q || p.name?.toLowerCase().includes(q) || p.sku?.toLowerCase().includes(q)
    const matchCat = !category || p.category === category
    return matchSearch && matchCat
  })
}

export function getCategories(products) {
  return [...new Set(products.map(p => p.category).filter(Boolean))]
}
