export const PRODUCT_UNITS = ['pcs','kg','gram','liter','ml','box','pack','lusin','roll','meter']
export const MOVEMENT_TYPES = ['in','out','adjustment']
export const MOVEMENT_COLORS = { in:'bg-green-100 text-green-700', out:'bg-red-100 text-red-700', adjustment:'bg-amber-100 text-amber-700' }
export const MOVEMENT_LABELS = { in:'Stock In', out:'Stock Out', adjustment:'Adjustment' }
export function getStockStatus(quantity, minStock) {
  const qty=parseFloat(quantity)||0, min=parseFloat(minStock)||0
  if(min===0)return 'normal';if(qty===0)return 'empty';if(qty<=min)return 'low';if(qty<=min*2)return 'warning';return 'normal'
}
export const STOCK_STATUS_CONFIG = {
  empty:   { label:'Habis',        color:'bg-red-100 text-red-700',      dot:'bg-red-500'    },
  low:     { label:'Menipis',      color:'bg-amber-100 text-amber-700',  dot:'bg-amber-500'  },
  warning: { label:'Hampir Habis', color:'bg-orange-100 text-orange-700',dot:'bg-orange-400' },
  normal:  { label:'Normal',       color:'bg-green-100 text-green-700',  dot:'bg-green-500'  },
}
export function formatUnit(quantity, unit) { return `${Number(quantity).toLocaleString('id-ID')} ${unit||'pcs'}` }
export function filterProducts(inventory, search, status) {
  return inventory.filter(item=>{
    const m = !search || item.product_name?.toLowerCase().includes(search.toLowerCase()) || item.product_sku?.toLowerCase().includes(search.toLowerCase()) || item.product_category?.toLowerCase().includes(search.toLowerCase())
    return m && (!status || getStockStatus(item.quantity,item.min_stock)===status)
  })
}
export function calcInventoryStats(inventory) {
  return {
    total:      inventory.length,
    lowStock:   inventory.filter(i=>getStockStatus(i.quantity,i.min_stock)==='low').length,
    empty:      inventory.filter(i=>getStockStatus(i.quantity,i.min_stock)==='empty').length,
    totalValue: inventory.reduce((s,i)=>s+((parseFloat(i.quantity)||0)*(parseFloat(i.product_price)||0)),0),
  }
}
