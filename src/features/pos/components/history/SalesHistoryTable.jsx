import { Eye, RotateCcw } from 'lucide-react'
import { cn } from '../../../../shared/utils/cn.js'
import Spinner from '../../../../shared/components/ui/Spinner.jsx'
import Button from '../../../../shared/components/ui/Button.jsx'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import { PAYMENT_METHOD_LABELS } from '../../utils/posHelpers.js'

export default function SalesHistoryTable({ sales, isLoading, onView, onRefund }) {
  if (isLoading) return <div className="flex justify-center py-16"><Spinner size="lg" className="text-ink-faint"/></div>
  if (!sales.length) return <p className="text-center text-xs text-ink-muted py-16">Belum ada transaksi</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead><tr className="border-b border-surface-border bg-surface-muted/50">
          {['No. Struk','Waktu','Kasir','Pelanggan','Total','Bayar','Status','Aksi'].map(h=>(
            <th key={h} className="px-4 py-3 text-2xs font-bold text-ink-muted uppercase tracking-wider whitespace-nowrap">{h}</th>
          ))}
        </tr></thead>
        <tbody className="bg-white">
          {sales.map(s=>(
            <tr key={s.id} className="border-b border-surface-border table-row-hover group">
              <td className="px-4 py-3 text-xs font-mono font-semibold text-brand-600">{s.receipt_no}</td>
              <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">{new Date(s.created_at).toLocaleString('id-ID',{hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'})}</td>
              <td className="px-4 py-3 text-xs text-ink-muted">{s.cashier_name||'—'}</td>
              <td className="px-4 py-3 text-xs text-ink-muted">{s.customer_name||'—'}</td>
              <td className="px-4 py-3 text-xs font-bold text-ink">{formatCurrency(s.total)}</td>
              <td className="px-4 py-3 text-xs text-ink-muted">{PAYMENT_METHOD_LABELS[s.payment_method]||s.payment_method}</td>
              <td className="px-4 py-3">
                <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold',s.is_refunded?'bg-red-100 text-red-600':'bg-green-100 text-green-700')}>
                  {s.is_refunded?'Refund':'Lunas'}
                </span>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="icon" onClick={()=>onView(s.id)} title="Detail"><Eye className="w-3.5 h-3.5"/></Button>
                  {!s.is_refunded && <Button variant="ghost" size="icon" onClick={()=>onRefund(s.id)} title="Refund"><RotateCcw className="w-3.5 h-3.5 text-red-500"/></Button>}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
