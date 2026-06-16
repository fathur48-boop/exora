import { useNavigate } from 'react-router-dom'
import { Edit2,Trash2,ExternalLink } from 'lucide-react'
import EmployeeStatusBadge from '../shared/EmployeeStatusBadge.jsx'
import Button from '../../../../shared/components/ui/Button.jsx'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import { formatDate } from '../../utils/hrHelpers.js'
export default function EmployeeRow({ employee:e,onEdit,onDelete }) {
  const navigate = useNavigate()
  return (
    <tr className="border-b border-surface-border table-row-hover group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">{e.full_name?.charAt(0)?.toUpperCase()}</div>
          <div><p className="text-sm font-semibold text-ink">{e.full_name}</p>{e.email&&<p className="text-2xs text-ink-faint">{e.email}</p>}</div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-ink-muted">{e.role||'—'}</td>
      <td className="px-4 py-3 text-sm text-ink-muted">{e.department||'—'}</td>
      <td className="px-4 py-3"><EmployeeStatusBadge status={e.status}/></td>
      <td className="px-4 py-3 text-sm font-bold text-ink">{formatCurrency(e.salary)}</td>
      <td className="px-4 py-3 text-xs text-ink-muted whitespace-nowrap">{formatDate(e.join_date)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={()=>navigate(`/hr/employees/${e.id}`)}><ExternalLink className="w-3.5 h-3.5"/></Button>
          <Button variant="ghost" size="icon" onClick={()=>onEdit(e)}><Edit2 className="w-3.5 h-3.5"/></Button>
          <Button variant="ghost" size="icon" onClick={()=>onDelete(e)}><Trash2 className="w-3.5 h-3.5 text-red-500"/></Button>
        </div>
      </td>
    </tr>
  )
}
