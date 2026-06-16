export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style:'currency', currency:'IDR', minimumFractionDigits:0, maximumFractionDigits:0,
  }).format(amount ?? 0)
}
export function calcGrowth(current, previous) {
  if (!previous || previous === 0) return null
  return (((current - previous) / previous) * 100).toFixed(1)
}
export function shortNumber(n) {
  if (n >= 1_000_000_000) return (n/1_000_000_000).toFixed(1)+'B'
  if (n >= 1_000_000)     return (n/1_000_000).toFixed(1)+'M'
  if (n >= 1_000)         return (n/1_000).toFixed(1)+'K'
  return String(n ?? 0)
}
