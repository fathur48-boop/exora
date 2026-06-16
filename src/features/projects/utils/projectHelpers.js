export const PROJECT_STATUSES = ['planning','active','on_hold','completed','cancelled']
export const TASK_STATUSES    = ['todo','in_progress','review','done']
export const PRIORITIES       = ['low','medium','high','critical']
export const PROJECT_STATUS_CONFIG = {
  planning:  {label:'Planning',  color:'bg-blue-100 text-blue-700',    dot:'bg-blue-500'   },
  active:    {label:'Active',    color:'bg-green-100 text-green-700',  dot:'bg-green-500'  },
  on_hold:   {label:'On Hold',   color:'bg-amber-100 text-amber-700',  dot:'bg-amber-500'  },
  completed: {label:'Completed', color:'bg-purple-100 text-purple-700',dot:'bg-purple-500' },
  cancelled: {label:'Cancelled', color:'bg-gray-100 text-gray-600',    dot:'bg-gray-400'   },
}
export const TASK_STATUS_CONFIG = {
  todo:        {label:'To Do',       color:'bg-gray-100 text-gray-700'   },
  in_progress: {label:'In Progress', color:'bg-blue-100 text-blue-700'   },
  review:      {label:'Review',      color:'bg-amber-100 text-amber-700' },
  done:        {label:'Done',        color:'bg-green-100 text-green-700' },
}
export const PRIORITY_CONFIG = {
  low:      {label:'Low',      color:'bg-gray-100 text-gray-600'    },
  medium:   {label:'Medium',   color:'bg-blue-100 text-blue-700'    },
  high:     {label:'High',     color:'bg-orange-100 text-orange-700'},
  critical: {label:'Critical', color:'bg-red-100 text-red-700'      },
}
export function calcProgress(tasks) {
  if(!tasks||!tasks.length)return 0
  return Math.round((tasks.filter(t=>t.status==='done').length/tasks.length)*100)
}
export function calcBudgetUsage(budget,spent) {
  const b=parseFloat(budget)||0,s=parseFloat(spent)||0
  if(!b)return 0
  return Math.min(Math.round((s/b)*100),100)
}
export function isOverdue(endDate) { return endDate && new Date(endDate)<new Date() }
export function filterProjects(projects,search,status,priority) {
  return projects.filter(p=>{
    const m = !search||p.name?.toLowerCase().includes(search.toLowerCase())||p.client_name?.toLowerCase().includes(search.toLowerCase())
    return m&&(!status||p.status===status)&&(!priority||p.priority===priority)
  })
}
export function formatDate(iso) {
  if(!iso)return '—'
  return new Date(iso).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})
}
