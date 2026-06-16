import { useState } from 'react'
import { Edit2,Trash2,ChevronDown,ChevronUp } from 'lucide-react'
import Button    from '../../../../shared/components/ui/Button.jsx'
import TaskForm  from './TaskForm.jsx'
import { cn }   from '../../../../shared/utils/cn.js'
import { TASK_STATUS_CONFIG,PRIORITY_CONFIG,formatDate } from '../../utils/projectHelpers.js'
const NEXT={todo:'in_progress',in_progress:'review',review:'done',done:'todo'}
export default function TaskItem({ task,onUpdate,onChangeStatus,onDelete,saving }) {
  const [editing,setEditing]   = useState(false)
  const [expanded,setExpanded] = useState(false)
  const sCfg = TASK_STATUS_CONFIG[task.status]??{label:task.status,color:'bg-gray-100 text-gray-600'}
  const pCfg = PRIORITY_CONFIG[task.priority]??{label:task.priority,color:'bg-gray-100 text-gray-600'}
  const isDone = task.status==='done'
  return (
    <div className={cn('border border-surface-border rounded-xl overflow-hidden transition-colors',isDone?'bg-surface-muted/50':'bg-white')}>
      {editing ? <div className="p-4"><TaskForm initial={task} onSubmit={async d=>{await onUpdate(task.id,d);setEditing(false)}} onCancel={()=>setEditing(false)} saving={saving}/></div>
      : <>
          <div className="flex items-center gap-3 px-4 py-3">
            <button onClick={()=>onChangeStatus(task.id,NEXT[task.status])}
              className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all',isDone?'border-green-500 bg-green-500':'border-surface-border hover:border-brand-500')}>
              {isDone&&<span className="text-white text-xs font-bold">✓</span>}
            </button>
            <div className="flex-1 min-w-0">
              <p className={cn('text-sm font-semibold',isDone?'line-through text-ink-faint':'text-ink')}>{task.title}</p>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                <span className={cn('text-2xs px-2 py-0.5 rounded-full font-semibold',sCfg.color)}>{sCfg.label}</span>
                <span className={cn('text-2xs px-2 py-0.5 rounded-full font-semibold',pCfg.color)}>{pCfg.label}</span>
                {task.assigned_name&&<span className="text-2xs text-ink-faint">@{task.assigned_name}</span>}
                {task.due_date&&<span className="text-2xs text-ink-faint">Due: {formatDate(task.due_date)}</span>}
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {task.description&&<button onClick={()=>setExpanded(v=>!v)} className="text-ink-faint hover:text-ink transition-colors">{expanded?<ChevronUp className="w-4 h-4"/>:<ChevronDown className="w-4 h-4"/>}</button>}
              <Button variant="ghost" size="icon" onClick={()=>setEditing(true)}><Edit2 className="w-3.5 h-3.5"/></Button>
              <Button variant="ghost" size="icon" onClick={()=>onDelete(task.id)}><Trash2 className="w-3.5 h-3.5 text-red-500"/></Button>
            </div>
          </div>
          {expanded&&task.description&&<div className="px-12 pb-3"><p className="text-xs text-ink-muted leading-relaxed">{task.description}</p></div>}
        </>}
    </div>
  )
}
