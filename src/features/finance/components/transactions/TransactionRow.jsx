import { useNavigate } from 'react-router-dom'
import { Edit2,Trash2,ExternalLink } from 'lucide-react'
import { TypeBadge,StatusBadge } from '../shared/TypeBadge.jsx'
import Button from '../../../../shared/components/ui/Button.jsx'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import { formatDate,PAYMENT_LABELS } from '../../utils/financeHelpers.js'
import { cn } from '../../../../shared/utils/cn.js'
export default function TransactionRow({ transaction:t,onEdit,onDelete }) {
  const navigate = useNavigate()
  return (
    <tr className="border-b border-surface-border table-row-hover group">
      <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap font-medium">{formatDate(t.date)}</td>
      <td className="px-4 py-3"><p className="text-sm font-semibold text-ink">{t.description}</p>{t.contact_name&&<p className="text-2xs text-ink-faint">{t.contact_name}</p>}</td>
      <td className="px-4 py-3 text-sm text-ink-muted">{t.category||'—'}</td>
      <td className="px-4 py-3"><TypeBadge type={t.type}/></td>
      <td className="px-4 py-3"><span className={cn('text-sm font-bold',t.type==='income'?'text-green-600':'text-red-600')}>{t.type==='income'?'+':'-'}{formatCurrency(t.amount)}</span></td>
      <td className="px-4 py-3"><StatusBadge status={t.status}/></td>
      <td className="px-4 py-3 text-xs text-ink-muted">{PAYMENT_LABELS[t.payment_method]??t.payment_method}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={()=>navigate(`/finance/${t.id}`)}><ExternalLink className="w-3.5 h-3.5"/></Button>
          <Button variant="ghost" size="icon" onClick={()=>onEdit(t)}><Edit2 className="w-3.5 h-3.5"/></Button>
          <Button variant="ghost" size="icon" onClick={()=>onDelete(t)}><Trash2 className="w-3.5 h-3.5 text-red-500"/></Button>
        </div>
      </td>
    </tr>
  )
}
