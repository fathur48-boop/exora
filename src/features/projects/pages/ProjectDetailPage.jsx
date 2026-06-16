import { useState }              from 'react'
import { useParams,useNavigate } from 'react-router-dom'
import { ArrowLeft,Edit2 }       from 'lucide-react'
import Topbar               from '../../../shared/components/ui/Topbar.jsx'
import Button               from '../../../shared/components/ui/Button.jsx'
import Spinner              from '../../../shared/components/ui/Spinner.jsx'
import Card, { CardBody,CardHeader } from '../../../shared/components/ui/Card.jsx'
import ProjectStatusBadge   from '../components/projects/ProjectStatusBadge.jsx'
import ProjectPriorityBadge from '../components/projects/ProjectPriorityBadge.jsx'
import ProjectForm          from '../components/projects/ProjectForm.jsx'
import TaskList             from '../components/tasks/TaskList.jsx'
import { useProjectDetail } from '../hooks/useProjectDetail.js'
import { useProjects }      from '../hooks/useProjects.js'
import { useTasks }         from '../hooks/useTasks.js'
import { formatCurrency }   from '../../dashboard/utils/dashboardHelpers.js'
import { formatDate,calcBudgetUsage,calcProgress } from '../utils/projectHelpers.js'

export default function ProjectDetailPage() {
  const { id } = useParams(); const navigate = useNavigate()
  const { project,isLoading,reload } = useProjectDetail(id)
  const { update,saving:projSaving } = useProjects()
  const { tasks,isLoading:taskLoading,saving:taskSaving,create:createTask,update:updateTask,changeStatus,remove:removeTask } = useTasks(id)
  const [editing,setEditing] = useState(false)
  if(isLoading)return <div className="flex items-center justify-center min-h-full"><Spinner size="lg" className="text-brand-400"/></div>
  if(!project)return null
  const handleUpdate=async(data)=>{await update(id,data);await reload();setEditing(false)}
  const progress=calcProgress(tasks), budgetPct=calcBudgetUsage(project.budget,project.spent)
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title={project.name} subtitle="Detail project"/>
      <div className="flex-1 p-6 flex flex-col gap-6 max-w-5xl">
        <button onClick={()=>navigate('/projects')} className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand-600 transition-colors w-fit font-medium"><ArrowLeft className="w-3.5 h-3.5"/> Kembali ke Projects</button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div><p className="text-sm font-bold text-ink">{project.name}</p>{project.client_name&&<p className="text-xs text-ink-muted">{project.client_name}</p>}</div>
                <Button variant="ghost" size="sm" leftIcon={<Edit2 className="w-3.5 h-3.5"/>} onClick={()=>setEditing(true)}>Edit</Button>
              </CardHeader>
              <CardBody>
                {editing ? <ProjectForm initial={project} onSubmit={handleUpdate} onCancel={()=>setEditing(false)} saving={projSaving}/>
                : <div className="flex flex-col gap-4">
                    <div className="flex flex-wrap gap-2"><ProjectStatusBadge status={project.status}/><ProjectPriorityBadge priority={project.priority}/></div>
                    {project.description&&<p className="text-sm text-ink-muted leading-relaxed">{project.description}</p>}
                    <div className="grid grid-cols-2 gap-4">
                      {[['Mulai',formatDate(project.start_date)],['Deadline',formatDate(project.end_date)],['Budget',formatCurrency(project.budget)],['Spent',formatCurrency(project.spent)]].map(([l,v])=>(
                        <div key={l}><p className="text-2xs text-ink-faint mb-0.5 font-medium uppercase tracking-wide">{l}</p><p className="text-sm font-bold text-ink">{v}</p></div>
                      ))}
                    </div>
                  </div>}
              </CardBody>
            </Card>
          </div>
          <div className="flex flex-col gap-4">
            <Card>
              <CardBody className="flex flex-col gap-4">
                <div>
                  <div className="flex justify-between mb-1.5"><p className="text-xs text-ink-muted font-medium">Task Progress</p><p className="text-xs font-bold text-ink">{progress}%</p></div>
                  <div className="h-2 bg-surface-subtle rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${progress}%`,background:progress===100?'#16a34a':'#4f46e5',transition:'width 0.5s'}}/></div>
                  <p className="text-2xs text-ink-faint mt-1">{tasks.filter(t=>t.status==='done').length}/{tasks.length} selesai</p>
                </div>
                {project.budget>0&&<div>
                  <div className="flex justify-between mb-1.5"><p className="text-xs text-ink-muted font-medium">Budget Usage</p><p className="text-xs font-bold text-ink">{budgetPct}%</p></div>
                  <div className="h-2 bg-surface-subtle rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${budgetPct}%`,background:budgetPct>=90?'#dc2626':budgetPct>=70?'#d97706':'#16a34a',transition:'width 0.5s'}}/></div>
                  <p className="text-2xs text-ink-faint mt-1">{formatCurrency(project.spent)} / {formatCurrency(project.budget)}</p>
                </div>}
              </CardBody>
            </Card>
          </div>
        </div>
        <Card>
          <CardBody>
            <TaskList tasks={tasks} isLoading={taskLoading} saving={taskSaving} onCreate={createTask} onUpdate={updateTask} onChangeStatus={changeStatus} onDelete={removeTask}/>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
