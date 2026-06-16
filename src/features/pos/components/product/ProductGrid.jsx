import { useState } from 'react'
import { Search, Package, SlidersHorizontal } from 'lucide-react'
import { cn } from '../../../../shared/utils/cn.js'
import Spinner from '../../../../shared/components/ui/Spinner.jsx'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import { filterProducts, getCategories } from '../../utils/posHelpers.js'

export default function ProductGrid({ products, inventory, onAddItem, isLoading }) {
  const [search,   setSearch]   = useState('')
  const [category, setCategory] = useState('')
  const [showAll,  setShowAll]  = useState(false)
  const categories = getCategories(products)
  const filtered   = filterProducts(products, inventory, search, category, showAll)

  const getStock = (productId) => {
    const inv = inventory.find(i => i.product_id === productId)
    return parseFloat(inv?.quantity) || 0
  }

  return (
    <div className="flex flex-col h-full">
      {/* Search & Filters */}
      <div className="flex flex-col gap-2 p-3 border-b border-surface-border bg-white">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-faint"/>
          <input
            value={search} onChange={e=>setSearch(e.target.value)}
            placeholder="Cari nama / SKU / barcode..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-surface-border bg-surface-muted text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-0.5">
          <button onClick={()=>setCategory('')} className={cn('px-2.5 py-1 rounded-lg text-2xs font-semibold whitespace-nowrap transition-all',!category?'bg-brand-600 text-white':'bg-surface-muted text-ink-muted hover:bg-surface-subtle')}>Semua</button>
          {categories.map(c=>(
            <button key={c} onClick={()=>setCategory(c===category?'':c)} className={cn('px-2.5 py-1 rounded-lg text-2xs font-semibold whitespace-nowrap transition-all',category===c?'bg-brand-600 text-white':'bg-surface-muted text-ink-muted hover:bg-surface-subtle')}>{c}</button>
          ))}
          <button onClick={()=>setShowAll(v=>!v)} className={cn('ml-auto px-2.5 py-1 rounded-lg text-2xs font-semibold whitespace-nowrap flex items-center gap-1 transition-all',showAll?'bg-amber-100 text-amber-700':'bg-surface-muted text-ink-muted hover:bg-surface-subtle')}>
            <SlidersHorizontal className="w-3 h-3"/>{showAll?'Semua produk':'Stok ada'}
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {isLoading ? <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
        : !filtered.length ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <Package className="w-8 h-8 text-ink-faint mb-2"/>
            <p className="text-xs text-ink-muted">Produk tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-2">
            {filtered.map(p => {
              const stock = getStock(p.id)
              const outOfStock = stock <= 0
              return (
                <button key={p.id} onClick={()=>!outOfStock&&onAddItem(p)} disabled={outOfStock}
                  className={cn('flex flex-col rounded-xl border p-3 text-left transition-all duration-150 group',
                    outOfStock ? 'border-surface-border bg-surface-muted opacity-50 cursor-not-allowed'
                    : 'border-surface-border bg-white hover:border-brand-300 hover:shadow-md hover:-translate-y-0.5 active:scale-95 cursor-pointer'
                  )}>
                  <div className="w-full aspect-square rounded-lg bg-gradient-to-br from-brand-50 to-violet-50 flex items-center justify-center mb-2 group-hover:from-brand-100 group-hover:to-violet-100 transition-all">
                    <Package className="w-6 h-6 text-brand-300"/>
                  </div>
                  <p className="text-xs font-semibold text-ink line-clamp-2 leading-tight mb-1">{p.name}</p>
                  {p.sku && <p className="text-2xs text-ink-faint font-mono mb-1">{p.sku}</p>}
                  <p className="text-xs font-bold text-brand-600 mt-auto">{formatCurrency(p.price)}</p>
                  <div className={cn('text-2xs font-semibold mt-0.5',outOfStock?'text-red-500':stock<=5?'text-amber-600':'text-green-600')}>
                    {outOfStock?'Habis':`Stok: ${stock} ${p.unit||'pcs'}`}
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
