import { Minus, Plus, Trash2, Tag } from 'lucide-react'
import { useState } from 'react'
import { cn } from '../../../../shared/utils/cn.js'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import { calcItemTotal } from '../../utils/posHelpers.js'

export default function CartItem({ item, onUpdateQty, onUpdateDiscount, onRemove }) {
  const [showDiscount, setShowDiscount] = useState(!!(item.discount_value))
  const total = calcItemTotal(item)

  return (
    <div className="border-b border-surface-border last:border-0 py-2.5 px-3">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-ink truncate">{item.name}</p>
          <p className="text-2xs text-ink-faint">{formatCurrency(item.price)} / {item.unit}</p>
        </div>
        <button onClick={()=>onRemove(item.product_id)} className="text-ink-faint hover:text-red-500 transition-colors shrink-0 mt-0.5">
          <Trash2 className="w-3.5 h-3.5"/>
        </button>
      </div>

      <div className="flex items-center justify-between mt-2">
        {/* Qty control */}
        <div className="flex items-center gap-1.5">
          <button onClick={()=>onUpdateQty(item.product_id, item.qty-1)} className="w-6 h-6 rounded-lg bg-surface-muted flex items-center justify-center text-ink hover:bg-surface-subtle transition-all">
            <Minus className="w-3 h-3"/>
          </button>
          <input type="number" value={item.qty} min={1} max={item.max_qty}
            onChange={e=>onUpdateQty(item.product_id, parseInt(e.target.value)||1)}
            className="w-10 h-6 text-center text-xs font-bold text-ink bg-transparent border border-surface-border rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-500/30"/>
          <button onClick={()=>onUpdateQty(item.product_id, item.qty+1)} disabled={item.qty>=item.max_qty} className="w-6 h-6 rounded-lg bg-surface-muted flex items-center justify-center text-ink hover:bg-surface-subtle transition-all disabled:opacity-30">
            <Plus className="w-3 h-3"/>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Discount toggle */}
          <button onClick={()=>setShowDiscount(v=>!v)} className={cn('w-6 h-6 rounded-lg flex items-center justify-center transition-all',showDiscount?'bg-amber-100 text-amber-600':'bg-surface-muted text-ink-faint hover:bg-surface-subtle')}>
            <Tag className="w-3 h-3"/>
          </button>
          {/* Subtotal */}
          <p className="text-xs font-bold text-ink w-24 text-right">{formatCurrency(total)}</p>
        </div>
      </div>

      {/* Discount row */}
      {showDiscount && (
        <div className="flex items-center gap-1.5 mt-1.5">
          <select value={item.discount_type} onChange={e=>onUpdateDiscount(item.product_id, e.target.value, item.discount_value)}
            className="h-6 px-1.5 rounded border border-surface-border bg-white text-2xs text-ink focus:outline-none">
            <option value="nominal">Rp</option>
            <option value="percent">%</option>
          </select>
          <input type="number" value={item.discount_value||''} min={0}
            onChange={e=>onUpdateDiscount(item.product_id, item.discount_type, e.target.value)}
            placeholder={item.discount_type==='percent'?'0%':'0'}
            className="flex-1 h-6 px-2 rounded border border-surface-border bg-white text-2xs text-ink focus:outline-none focus:ring-1 focus:ring-amber-400"/>
          {item.discount_value>0 && (
            <span className="text-2xs text-amber-600 font-semibold">
              -{item.discount_type==='percent'?item.discount_value+'%':formatCurrency(item.discount_value)}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
