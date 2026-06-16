import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import Button from '../../../../shared/components/ui/Button.jsx'
export default function ShiftSummary({ shift, onDismiss }) {
  if (!shift) return null
  const duration = shift.closed_at && shift.opened_at
    ? Math.round((new Date(shift.closed_at) - new Date(shift.opened_at)) / 60000)
    : 0
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal border border-surface-border w-full max-w-sm p-6 animate-slide-up">
        <h2 className="text-sm font-bold text-ink mb-4 text-center">Ringkasan Shift</h2>
        <div className="flex flex-col gap-2 mb-5">
          {[['Kasir', shift.cashier_name],['Dibuka', new Date(shift.opened_at).toLocaleString('id-ID')],['Ditutup', new Date(shift.closed_at).toLocaleString('id-ID')],['Durasi', duration + ' menit'],['Modal Awal', formatCurrency(shift.opening_cash)],['Total Penjualan', formatCurrency(shift.total_sales)],['Total Transaksi', String(shift.total_transactions)],['Uang Fisik', formatCurrency(shift.closing_cash)],['Selisih', formatCurrency(shift.closing_cash - shift.opening_cash - shift.total_sales)]].map(([k,v])=>(
            <div key={k} className="flex justify-between text-xs border-b border-surface-border pb-1">
              <span className="text-ink-muted">{k}</span><span className="font-semibold text-ink">{v}</span>
            </div>
          ))}
          {shift.notes && <p className="text-xs text-ink-muted mt-1">Catatan: {shift.notes}</p>}
        </div>
        <Button className="w-full" size="sm" onClick={onDismiss}>Tutup</Button>
      </div>
    </div>
  )
}
