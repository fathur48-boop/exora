import { useNavigate } from 'react-router-dom'
import { Edit2, Trash2, ExternalLink } from 'lucide-react'
import CustomerStatusBadge from './CustomerStatusBadge.jsx'
import Button from '../../../../shared/components/ui/Button.jsx'
export default function CustomerRow({ customer:c, onEdit, onDelete }) {
  const navigate = useNavigate()
  return (
    <tr className="border-b border-surface-border table-row-hover group">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 text-xs font-bold shrink-0">
            {c.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">{c.name}</p>
            {c.company&&<p className="text-2xs text-ink-faint">{c.company}</p>}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-ink-muted">{c.email||'—'}</td>
      <td className="px-4 py-3 text-sm text-ink-muted">{c.phone||'—'}</td>
      <td className="px-4 py-3"><CustomerStatusBadge status={c.status}/></td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={()=>navigate(`/crm/customers/${c.id}`)}><ExternalLink className="w-3.5 h-3.5"/></Button>
          <Button variant="ghost" size="icon" onClick={()=>onEdit(c)}><Edit2 className="w-3.5 h-3.5"/></Button>
          <Button variant="ghost" size="icon" onClick={()=>onDelete(c)}><Trash2 className="w-3.5 h-3.5 text-red-500"/></Button>
        </div>
      </td>
    </tr>
  )
}
