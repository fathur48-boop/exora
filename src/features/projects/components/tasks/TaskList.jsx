import { useState } from 'react'
import { Plus }     from 'lucide-react'
import TaskItem     from './TaskItem.jsx'
import TaskForm     from './TaskForm.jsx'
import Button       from '../../../../shared/components/ui/Button.jsx'
import Spinner      from '../../../../shared/components/ui/Spinner.jsx'
import { TASK_STATUSES,TASK_STATUS_CONFIG,calcProgress } from '../../utils/projectHelpers.js'
export default function TaskList({ tasks,isLoading,saving,onCreate,onUpdate,onChangeStatus,onDelete }) {
  const [showForm,setShowForm] = useState(false)
  const progress = calcProgress(tasks)
  if(isLoading)return <div className="flex justify-center py-10"><Spinner size="lg" className="text-ink-faint"/></div>
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-bold text-ink">Tasks</h3>
          <span className="text-2xs text-ink-faint font-medium">{tasks.filter(t=>t.status==='done').length}/{tasks.length} selesai</span>
        </div>
        <Button size="sm" variant="secondary" leftIcon={<Plus className="w-3.5 h-3.5"/>} onClick={()=>setShowForm(true)}>Task baru</Button>
      </div>
      {tasks.length>0&&<div className="h-2 bg-surface-subtle rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{width:`${progress}%`,background:progress===100?'#16a34a':'#4f46e5'}}/></div>}
      {showForm&&<div className="border border-brand-200 bg-brand-50/50 rounded-xl p-4"><TaskForm onSubmit={async d=>{await onCreate(d);setShowForm(false)}} onCancel={()=>setShowForm(false)} saving={saving}/></div>}
      {TASK_STATUSES.map(status=>{
        const statusTasks=tasks.filter(t=>t.status===status)
        if(!statusTasks.length)return null
        const cfg=TASK_STATUS_CONFIG[status]
        return <div key={status}>
          <p className={`text-2xs font-bold uppercase tracking-wider mb-2 px-1 ${cfg.color.split(' ')[1]}`}>{cfg.label} ({statusTasks.length})</p>
          <div className="flex flex-col gap-2">{statusTasks.map(task=><TaskItem key={task.id} task={task} onUpdate={onUpdate} onChangeStatus={onChangeStatus} onDelete={onDelete} saving={saving}/>)}</div>
        </div>
      })}
      {!tasks.length&&!showForm&&<div className="text-center py-10"><p className="text-sm text-ink-faint">Belum ada task. Tambahkan task pertama.</p></div>}
    </div>
  )
}
