import { Clock, Play, Trash2, X } from 'lucide-react'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import { calcCartTotal } from '../../utils/posHelpers.js'
import Button from '../../../../shared/components/ui/Button.jsx'

export default function HeldCartsPanel({ heldCarts, onResume, onRemove, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal border border-surface-border w-full max-w-sm p-5 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-600"/><p className="text-sm font-bold text-ink">Transaksi Ditahan</p></div>
          <button onClick={onClose} className="text-ink-faint hover:text-ink transition-colors"><X className="w-4 h-4"/></button>
        </div>
        {!heldCarts.length ? <p className="text-xs text-ink-muted text-center py-6">Tidak ada transaksi ditahan</p>
        : <div className="flex flex-col gap-2">
            {heldCarts.map((c, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-surface-border bg-surface-muted">
                <div>
                  <p className="text-xs font-semibold text-ink">{c.label}</p>
                  <p className="text-2xs text-ink-faint">{c.items.length} item • {formatCurrency(calcCartTotal(c.items, c.cartDiscount, c.cartDiscountType))}</p>
                  <p className="text-2xs text-ink-faint">{new Date(c.heldAt).toLocaleTimeString('id-ID')}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={()=>{onResume(i);onClose()}} className="w-7 h-7 rounded-lg bg-brand-100 text-brand-600 flex items-center justify-center hover:bg-brand-200 transition-all"><Play className="w-3.5 h-3.5"/></button>
                  <button onClick={()=>onRemove(i)} className="w-7 h-7 rounded-lg bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-all"><Trash2 className="w-3.5 h-3.5"/></button>
                </div>
              </div>
            ))}
          </div>}
        <button onClick={onClose} className="w-full mt-4 text-xs text-ink-muted hover:text-ink transition-colors">Tutup</button>
      </div>
    </div>
  )
}
