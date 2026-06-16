import { useNavigate }           from 'react-router-dom'
import { Edit2,Trash2,Calendar,User } from 'lucide-react'
import ProjectStatusBadge        from './ProjectStatusBadge.jsx'
import ProjectPriorityBadge      from './ProjectPriorityBadge.jsx'
import Button                    from '../../../../shared/components/ui/Button.jsx'
import { formatCurrency }        from '../../../dashboard/utils/dashboardHelpers.js'
import { calcBudgetUsage,calcProgress,formatDate,isOverdue } from '../../utils/projectHelpers.js'
import { cn }                    from '../../../../shared/utils/cn.js'
export default function ProjectCard({ project:p,tasks,onEdit,onDelete }) {
  const navigate  = useNavigate()
  const progress  = calcProgress(tasks)
  const budgetPct = calcBudgetUsage(p.budget,p.spent)
  const overdue   = isOverdue(p.end_date)&&p.status!=='completed'&&p.status!=='cancelled'
  return (
    <div className="stat-card bg-white border border-surface-border rounded-xl p-5 flex flex-col gap-4 hover:border-brand-300">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <button onClick={()=>navigate(`/projects/${p.id}`)} className="text-sm font-bold text-ink hover:text-brand-600 transition-colors text-left block truncate w-full">{p.name}</button>
          {p.client_name&&<div className="flex items-center gap-1 mt-0.5"><User className="w-3 h-3 text-ink-faint"/><p className="text-2xs text-ink-faint truncate">{p.client_name}</p></div>}
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" onClick={()=>onEdit(p)}><Edit2 className="w-3.5 h-3.5"/></Button>
          <Button variant="ghost" size="icon" onClick={()=>onDelete(p)}><Trash2 className="w-3.5 h-3.5 text-red-500"/></Button>
        </div>
      </div>
      <div className="flex flex-wrap gap-2"><ProjectStatusBadge status={p.status}/><ProjectPriorityBadge priority={p.priority}/></div>
      {tasks!==undefined&&<div>
        <div className="flex items-center justify-between mb-1.5"><p className="text-2xs text-ink-faint font-medium">Progress tasks</p><p className="text-2xs font-bold text-ink">{progress}%</p></div>
        <div className="h-1.5 bg-surface-subtle rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{width:`${progress}%`,background:progress===100?'#16a34a':'#4f46e5'}}/></div>
        <p className="text-2xs text-ink-faint mt-1">{tasks.filter(t=>t.status==='done').length}/{tasks.length} tasks selesai</p>
      </div>}
      {p.budget>0&&<div>
        <div className="flex items-center justify-between mb-1.5"><p className="text-2xs text-ink-faint font-medium">Budget</p><p className="text-2xs font-bold text-ink">{budgetPct}%</p></div>
        <div className="h-1.5 bg-surface-subtle rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{width:`${budgetPct}%`,background:budgetPct>=90?'#dc2626':budgetPct>=70?'#d97706':'#16a34a'}}/></div>
        <div className="flex justify-between mt-1"><p className="text-2xs text-ink-faint">{formatCurrency(p.spent)} spent</p><p className="text-2xs text-ink-faint">{formatCurrency(p.budget)} total</p></div>
      </div>}
      {p.end_date&&<div className={cn('flex items-center gap-1.5 text-2xs font-medium',overdue?'text-red-500':'text-ink-faint')}><Calendar className="w-3 h-3"/>{overdue?'Overdue: ':'Deadline: '}{formatDate(p.end_date)}</div>}
    </div>
  )
}
