import { useState } from 'react'
import { ArrowDownCircle, ArrowUpCircle, SlidersHorizontal } from 'lucide-react'
import Button from '../../../../shared/components/ui/Button.jsx'
import Input  from '../../../../shared/components/ui/Input.jsx'
import { cn } from '../../../../shared/utils/cn.js'
const MODES = [
  { key:'in',         label:'Stock In',   icon:ArrowUpCircle,     color:'text-green-600' },
  { key:'out',        label:'Stock Out',  icon:ArrowDownCircle,   color:'text-red-600'   },
  { key:'adjustment', label:'Adjustment', icon:SlidersHorizontal, color:'text-amber-600' },
]
export default function StockAdjustModal({ productName,currentStock,unit,onConfirm,onCancel,saving }) {
  const [mode,setMode]     = useState('in')
  const [quantity,setQty]  = useState('')
  const [notes,setNotes]   = useState('')
  const [reference,setRef] = useState('')
  const [error,setError]   = useState(null)
  const handleSubmit = async(e)=>{e.preventDefault();const qty=parseFloat(quantity);if(!quantity||isNaN(qty)||qty<=0){setError('Jumlah harus lebih dari 0');return};await onConfirm({mode,quantity:qty,notes,reference})}
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal border border-surface-border w-full max-w-md p-6 animate-slide-up">
        <h2 className="text-sm font-bold text-ink mb-1">Kelola Stok</h2>
        <p className="text-xs text-ink-muted mb-5">{productName} · Stok saat ini: <strong>{currentStock} {unit}</strong></p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            {MODES.map(({key,label,icon:Icon,color})=>(
              <button key={key} type="button" onClick={()=>{setMode(key);setError(null)}}
                className={cn('flex flex-col items-center gap-1.5 py-3 rounded-xl border text-xs font-semibold transition-all',
                  mode===key ? 'border-brand-500 bg-brand-50 text-brand-700 shadow-sm' : 'border-surface-border bg-white text-ink-muted hover:bg-surface-subtle')}>
                <Icon className={cn('w-4 h-4',mode===key?'text-brand-600':color)}/>{label}
              </button>
            ))}
          </div>
          <Input label={mode==='adjustment'?'Stok baru *':'Jumlah *'} type="number" min="0" value={quantity}
            onChange={e=>{setQty(e.target.value);setError(null)}} placeholder="0" error={error}/>
          <Input label="Referensi" value={reference} onChange={e=>setRef(e.target.value)} placeholder="No. PO / SO / Invoice"/>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-ink-secondary tracking-wide">Catatan</label>
            <textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="Keterangan…"
              className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none transition-all"/>
          </div>
          <div className="flex gap-2 justify-end pt-1">
            <Button type="button" variant="secondary" size="sm" onClick={onCancel} disabled={saving}>Batal</Button>
            <Button type="submit" size="sm" loading={saving}>Simpan</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
