import { ShoppingBag, CreditCard, TrendingUp, Hash } from 'lucide-react'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import { PAYMENT_METHOD_LABELS } from '../../utils/posHelpers.js'

export default function PosSummaryCards({ summary }) {
  if (!summary) return null
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
      {[
        { label:'Total Penjualan', value: formatCurrency(summary.total_sales), icon: TrendingUp, color:'text-green-600', bg:'bg-green-50' },
        { label:'Total Transaksi', value: String(summary.total_transactions), icon: Hash, color:'text-brand-600', bg:'bg-brand-50' },
      ].map(c=>(
        <div key={c.label} className="bg-white border border-surface-border rounded-xl p-4 shadow-card">
          <div className={`w-8 h-8 rounded-lg ${c.bg} flex items-center justify-center mb-2`}><c.icon className={`w-4 h-4 ${c.color}`}/></div>
          <p className="text-2xs text-ink-faint font-medium uppercase tracking-wide mb-0.5">{c.label}</p>
          <p className={`text-base font-bold ${c.color}`}>{c.value}</p>
        </div>
      ))}
      {Object.entries(summary.by_payment_method||{}).map(([m,v])=>(
        <div key={m} className="bg-white border border-surface-border rounded-xl p-4 shadow-card">
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mb-2"><CreditCard className="w-4 h-4 text-purple-600"/></div>
          <p className="text-2xs text-ink-faint font-medium uppercase tracking-wide mb-0.5">{PAYMENT_METHOD_LABELS[m]||m}</p>
          <p className="text-base font-bold text-ink">{formatCurrency(v)}</p>
        </div>
      ))}
    </div>
  )
}
