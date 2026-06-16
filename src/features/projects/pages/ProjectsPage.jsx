import { useState } from 'react'
import { Plus }     from 'lucide-react'
import Topbar             from '../../../shared/components/ui/Topbar.jsx'
import Button             from '../../../shared/components/ui/Button.jsx'
import Alert              from '../../../shared/components/ui/Alert.jsx'
import Spinner            from '../../../shared/components/ui/Spinner.jsx'
import ProjectStatCards   from '../components/shared/ProjectStatCards.jsx'
import ProjectCard        from '../components/projects/ProjectCard.jsx'
import ProjectForm        from '../components/projects/ProjectForm.jsx'
import DeleteConfirmModal from '../../crm/components/shared/DeleteConfirmModal.jsx'
import CrmSearchBar       from '../../crm/components/shared/CrmSearchBar.jsx'
import { useProjects }    from '../hooks/useProjects.js'
import { useProjectStore } from '../store/projectStore.js'
import { filterProjects,PROJECT_STATUSES,PRIORITIES } from '../utils/projectHelpers.js'

const modal    = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
const modalBox = "bg-white rounded-2xl shadow-modal border border-surface-border w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up"
const sel      = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"

export default function ProjectsPage() {
  const { projects,summary,isLoading,saving,error,reload,create,update,remove } = useProjects()
  const { tasks } = useProjectStore()
  const [search,setSearch]       = useState('')
  const [statusFilter,setStatus] = useState('')
  const [priorityFilter,setPrio] = useState('')
  const [showForm,setShowForm]   = useState(false)
  const [editTarget,setEdit]     = useState(null)
  const [deleteTarget,setDelete] = useState(null)
  const filtered = filterProjects(projects,search,statusFilter,priorityFilter)
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Projects" subtitle={`${projects.length} project`} onRefresh={reload} isRefreshing={isLoading}/>
      <div className="flex-1 p-6 flex flex-col gap-5">
        {error && <Alert type="error" message={error}/>}
        <ProjectStatCards summary={summary} isLoading={isLoading}/>
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <CrmSearchBar value={search} onChange={setSearch} placeholder="Cari project…" className="w-56"/>
            <select value={statusFilter}   onChange={e=>setStatus(e.target.value)} className={sel}><option value="">Semua status</option>{PROJECT_STATUSES.map(s=><option key={s} value={s} className="capitalize">{s.replace('_',' ')}</option>)}</select>
            <select value={priorityFilter} onChange={e=>setPrio(e.target.value)}   className={sel}><option value="">Semua priority</option>{PRIORITIES.map(p=><option key={p} value={p} className="capitalize">{p}</option>)}</select>
          </div>
          <Button size="sm" leftIcon={<Plus className="w-4 h-4"/>} onClick={()=>setShowForm(true)}>Buat project</Button>
        </div>
        {isLoading&&!projects.length ? <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
        : filtered.length===0 ? <div className="text-center py-16"><p className="text-sm text-ink-faint">Belum ada project yang cocok</p></div>
        : <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(p=><ProjectCard key={p.id} project={p} tasks={tasks[p.id]} onEdit={setEdit} onDelete={setDelete}/>)}
          </div>}
      </div>
      {showForm && <div className={modal}><div className={modalBox}><h2 className="text-sm font-bold text-ink mb-5">Buat Project Baru</h2><ProjectForm onSubmit={async d=>{await create(d);setShowForm(false)}} onCancel={()=>setShowForm(false)} saving={saving}/></div></div>}
      {editTarget && <div className={modal}><div className={modalBox}><h2 className="text-sm font-bold text-ink mb-5">Edit Project</h2><ProjectForm initial={editTarget} onSubmit={async d=>{await update(editTarget.id,d);setEdit(null)}} onCancel={()=>setEdit(null)} saving={saving}/></div></div>}
      {deleteTarget && <DeleteConfirmModal title="Hapus project" description={`"${deleteTarget.name}" dan semua tasks-nya akan dihapus permanen.`} onConfirm={async()=>{await remove(deleteTarget.id);setDelete(null)}} onCancel={()=>setDelete(null)} isLoading={saving}/>}
    </div>
  )
}
