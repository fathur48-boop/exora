import { X } from 'lucide-react'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import { formatReceiptDate, calcItemTotal, PAYMENT_METHOD_LABELS } from '../../utils/posHelpers.js'
import Spinner from '../../../../shared/components/ui/Spinner.jsx'

export default function SaleDetailModal({ sale, isLoading, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-modal border border-surface-border w-full max-w-md p-5 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-bold text-ink">{sale?.receipt_no || 'Detail Transaksi'}</p>
          <button onClick={onClose} className="text-ink-faint hover:text-ink transition-colors"><X className="w-4 h-4"/></button>
        </div>
        {isLoading ? <div className="flex justify-center py-12"><Spinner size="lg" className="text-ink-faint"/></div>
        : sale ? <>
          <div className="bg-surface-muted rounded-xl p-3 mb-4 grid grid-cols-2 gap-2">
            {[['Tanggal',formatReceiptDate(sale.created_at)],['Kasir',sale.cashier_name||'—'],['Pelanggan',sale.customer_name||'—'],['Metode',PAYMENT_METHOD_LABELS[sale.payment_method]||sale.payment_method]].map(([k,v])=>(
              <div key={k}><p className="text-2xs text-ink-faint font-medium uppercase tracking-wide">{k}</p><p className="text-xs font-semibold text-ink">{v}</p></div>
            ))}
          </div>
          <div className="flex flex-col gap-1.5 mb-4">
            {(sale.items||[]).map((item,i)=>(
              <div key={i} className="flex justify-between text-xs py-1.5 border-b border-surface-border last:border-0">
                <div><p className="font-semibold text-ink">{item.product_name||item.name}</p><p className="text-ink-muted">{item.qty} × {formatCurrency(item.price)}</p></div>
                <p className="font-bold text-ink">{formatCurrency(calcItemTotal(item))}</p>
              </div>
            ))}
          </div>
          <div className="bg-surface-muted rounded-xl p-3 flex flex-col gap-1">
            {sale.discount>0 && <div className="flex justify-between text-xs text-amber-600"><span>Diskon</span><span>-{formatCurrency(sale.discount)}</span></div>}
            <div className="flex justify-between text-sm font-bold"><span>Total</span><span className="text-brand-600">{formatCurrency(sale.total)}</span></div>
            <div className="flex justify-between text-xs"><span className="text-ink-muted">Dibayar</span><span>{formatCurrency(sale.amount_paid)}</span></div>
            {sale.change_amount>0 && <div className="flex justify-between text-xs"><span className="text-ink-muted">Kembalian</span><span>{formatCurrency(sale.change_amount)}</span></div>}
            {sale.points_earned>0 && <div className="flex justify-between text-xs text-green-600"><span>Poin Earned</span><span>+{sale.points_earned}</span></div>}
          </div>
          {sale.is_refunded && <div className="mt-3 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-600 font-semibold text-center">⚠ Transaksi ini telah di-refund</div>}
        </> : <p className="text-xs text-ink-muted text-center py-6">Data tidak ditemukan</p>}
        <button onClick={onClose} className="w-full mt-4 text-xs text-ink-muted hover:text-ink transition-colors">Tutup</button>
      </div>
    </div>
  )
}
