import { useState } from 'react'
import { Clock, DollarSign, X } from 'lucide-react'
import Button from '../../../../shared/components/ui/Button.jsx'
import Input  from '../../../../shared/components/ui/Input.jsx'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
export default function ShiftModal({ shift, onOpen, onClose, user }) {
  const [openingCash, setOpeningCash] = useState('')
  const [closingCash, setClosingCash] = useState('')
  const [notes,       setNotes]       = useState('')
  const [mode, setMode] = useState(shift.activeShift ? 'close' : 'open')
  const ipt = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all w-full"
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal border border-surface-border w-full max-w-md p-6 animate-slide-up">
        {!shift.activeShift ? <>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-green-100 flex items-center justify-center"><Clock className="w-5 h-5 text-green-600"/></div>
            <div><p className="text-sm font-bold text-ink">Buka Shift Kasir</p><p className="text-2xs text-ink-faint">Mulai sesi penjualan</p></div>
          </div>
          <p className="text-xs text-ink-muted mb-4">Kasir: <strong>{user?.full_name}</strong></p>
          <div className="flex flex-col gap-1.5 mb-5">
            <label className="text-xs font-semibold text-ink-secondary">Modal Awal (IDR)</label>
            <input type="number" value={openingCash} onChange={e=>setOpeningCash(e.target.value)} placeholder="0" className={ipt}/>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={()=>{}}>Nanti</Button>
            <Button size="sm" onClick={()=>onOpen(user?.id, user?.full_name, openingCash)}>Buka Shift</Button>
          </div>
        </> : <>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center"><DollarSign className="w-5 h-5 text-red-600"/></div>
            <div><p className="text-sm font-bold text-ink">Tutup Shift</p><p className="text-2xs text-ink-faint">Kasir: {shift.activeShift.cashier_name}</p></div>
          </div>
          <div className="bg-surface-muted rounded-xl p-4 mb-4 flex flex-col gap-2">
            <div className="flex justify-between text-xs"><span className="text-ink-muted">Total Penjualan</span><span className="font-bold text-green-600">{formatCurrency(shift.activeShift.total_sales)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-ink-muted">Total Transaksi</span><span className="font-bold text-ink">{shift.activeShift.total_transactions}</span></div>
            <div className="flex justify-between text-xs"><span className="text-ink-muted">Modal Awal</span><span className="font-bold text-ink">{formatCurrency(shift.activeShift.opening_cash)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-ink-muted">Dibuka</span><span className="font-bold text-ink">{new Date(shift.activeShift.opened_at).toLocaleTimeString('id-ID')}</span></div>
          </div>
          <div className="flex flex-col gap-3 mb-5">
            <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary">Uang Fisik di Kas (IDR)</label><input type="number" value={closingCash} onChange={e=>setClosingCash(e.target.value)} placeholder="0" className={ipt}/></div>
            <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary">Catatan</label><textarea value={notes} onChange={e=>setNotes(e.target.value)} rows={2} placeholder="Catatan penutup shift..." className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"/></div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" size="sm" onClick={()=>{}}>Batal</Button>
            <Button size="sm" className="bg-red-600 hover:bg-red-700" onClick={()=>onClose(closingCash, notes)}>Tutup Shift</Button>
          </div>
        </>}
      </div>
    </div>
  )
}
