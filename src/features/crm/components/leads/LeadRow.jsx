import { useNavigate } from 'react-router-dom'
import { Edit2, Trash2, ExternalLink } from 'lucide-react'
import LeadStageSelect from './LeadStageSelect.jsx'
import Button from '../../../../shared/components/ui/Button.jsx'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import { formatSourceLabel } from '../../utils/crmHelpers.js'
export default function LeadRow({ lead:l, onEdit, onDelete, onStageChange }) {
  const navigate = useNavigate()
  return (
    <tr className="border-b border-surface-border table-row-hover group">
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-ink">{l.name}</p>
        {l.company&&<p className="text-2xs text-ink-faint">{l.company}</p>}
      </td>
      <td className="px-4 py-3 text-sm text-ink-muted">{formatSourceLabel(l.source)}</td>
      <td className="px-4 py-3"><LeadStageSelect value={l.stage} onChange={stage=>onStageChange(l.id,stage)}/></td>
      <td className="px-4 py-3 text-sm font-bold text-ink">{l.value?formatCurrency(l.value):'—'}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={()=>navigate(`/crm/leads/${l.id}`)}><ExternalLink className="w-3.5 h-3.5"/></Button>
          <Button variant="ghost" size="icon" onClick={()=>onEdit(l)}><Edit2 className="w-3.5 h-3.5"/></Button>
          <Button variant="ghost" size="icon" onClick={()=>onDelete(l)}><Trash2 className="w-3.5 h-3.5 text-red-500"/></Button>
        </div>
      </td>
    </tr>
  )
}
