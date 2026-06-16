import { useState } from 'react'
import { Plus } from 'lucide-react'
import Topbar             from '../../../shared/components/ui/Topbar.jsx'
import Button             from '../../../shared/components/ui/Button.jsx'
import Alert              from '../../../shared/components/ui/Alert.jsx'
import LeadTable          from '../components/leads/LeadTable.jsx'
import LeadForm           from '../components/leads/LeadForm.jsx'
import DeleteConfirmModal from '../components/shared/DeleteConfirmModal.jsx'
import CrmSearchBar       from '../components/shared/CrmSearchBar.jsx'
import ExportImportBar    from '../../../shared/components/ui/ExportImportBar.jsx'
import { useLeads }       from '../hooks/useLeads.js'
import { filterLeads, LEAD_STAGES, formatStageLabel } from '../utils/crmHelpers.js'

const LEAD_COLUMNS = [
  { key:'name', label:'Nama' },
  { key:'email', label:'Email' },
  { key:'phone', label:'Telepon' },
  { key:'company', label:'Perusahaan' },
  { key:'source', label:'Sumber' },
  { key:'stage', label:'Stage' },
  { key:'value', label:'Nilai' },
  { key:'notes', label:'Catatan' },
]

const sel = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"
const modal = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
const modalBox = "bg-white rounded-2xl shadow-modal border border-surface-border w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up"

export default function LeadsPage() {
  const { leads, isLoading, saving, error, load, create, update, changeStage, remove, importRows } = useLeads()
  const [search,setSearch] = useState('')
  const [stageFilter,setStage] = useState('')
  const [showForm,setShowForm] = useState(false)
  const [editTarget,setEditTarget] = useState(null)
  const [deleteTarget,setDelete] = useState(null)
  const filtered = filterLeads(leads, search, stageFilter)

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Leads" subtitle={`${leads.length} lead`} onRefresh={load} isRefreshing={isLoading}/>
      <div className="flex-1 p-6 flex flex-col gap-4">
        {error && <Alert type="error" message={error}/>}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <CrmSearchBar value={search} onChange={setSearch} placeholder="Cari lead…" className="w-64"/>
            <select value={stageFilter} onChange={e=>setStage(e.target.value)} className={sel}>
              <option value="">Semua stage</option>
              {LEAD_STAGES.map(s=><option key={s} value={s}>{formatStageLabel(s)}</option>)}
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <ExportImportBar data={filtered} columns={LEAD_COLUMNS} filename="leads" onImport={importRows}/>
            <Button size="sm" leftIcon={<Plus className="w-4 h-4"/>} onClick={()=>setShowForm(true)}>Tambah lead</Button>
          </div>
        </div>
        <div className="bg-white border border-surface-border rounded-xl shadow-card overflow-hidden">
          <LeadTable leads={filtered} isLoading={isLoading} onEdit={setEditTarget} onDelete={setDelete} onStageChange={changeStage}/>
        </div>
      </div>

      {showForm && <div className={modal}><div className={modalBox}>
        <h2 className="text-sm font-bold text-ink mb-5">Lead Baru</h2>
        <LeadForm onSubmit={async d=>{await create(d);setShowForm(false)}} onCancel={()=>setShowForm(false)} saving={saving}/>
      </div></div>}

      {editTarget && <div className={modal}><div className={modalBox}>
        <h2 className="text-sm font-bold text-ink mb-5">Edit Lead</h2>
        <LeadForm initial={editTarget} onSubmit={async d=>{await update(editTarget.id,d);setEditTarget(null)}} onCancel={()=>setEditTarget(null)} saving={saving}/>
      </div></div>}

      {deleteTarget && <DeleteConfirmModal title="Hapus lead" description={`"${deleteTarget.name}" akan dihapus permanen.`}
        onConfirm={async()=>{await remove(deleteTarget.id);setDelete(null)}} onCancel={()=>setDelete(null)} isLoading={saving}/>}
    </div>
  )
}
