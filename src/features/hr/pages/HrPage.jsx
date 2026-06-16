import { useState } from 'react'
import { Plus }     from 'lucide-react'
import Topbar             from '../../../shared/components/ui/Topbar.jsx'
import Button             from '../../../shared/components/ui/Button.jsx'
import Alert              from '../../../shared/components/ui/Alert.jsx'
import HrStatCards         from '../components/shared/HrStatCards.jsx'
import EmployeeTable       from '../components/employees/EmployeeTable.jsx'
import EmployeeForm        from '../components/employees/EmployeeForm.jsx'
import LeaveTable          from '../components/leave/LeaveTable.jsx'
import DeleteConfirmModal  from '../../crm/components/shared/DeleteConfirmModal.jsx'
import CrmSearchBar        from '../../crm/components/shared/CrmSearchBar.jsx'
import ExportImportBar     from '../../../shared/components/ui/ExportImportBar.jsx'
import { useEmployees }    from '../hooks/useEmployees.js'

const EMPLOYEE_COLUMNS = [
  { key:'full_name', label:'Nama Lengkap' },
  { key:'email', label:'Email' },
  { key:'phone', label:'Telepon' },
  { key:'role', label:'Jabatan' },
  { key:'department', label:'Departemen' },
  { key:'status', label:'Status' },
  { key:'salary', label:'Gaji' },
  { key:'join_date', label:'Tanggal Masuk' },
  { key:'birth_date', label:'Tanggal Lahir' },
  { key:'address', label:'Alamat' },
  { key:'emergency_contact', label:'Kontak Darurat' },
  { key:'notes', label:'Catatan' },
]
import { useLeaveRequests } from '../hooks/useLeaveRequests.js'
import { filterEmployees,EMPLOYEE_STATUSES,getDepartments } from '../utils/hrHelpers.js'

const modal    = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
const modalBox = "bg-white rounded-2xl shadow-modal border border-surface-border w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up"
const sel      = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"
const TABS = ['Karyawan','Pengajuan Cuti']

export default function HrPage() {
  const { employees,summary,isLoading,saving,error,reload,create,update,remove,importRows } = useEmployees()
  const { leaveRequests,isLoading:leaveLoading,approve,reject,remove:removeLeave } = useLeaveRequests()
  const [activeTab,setTab]   = useState('Karyawan')
  const [search,setSearch]   = useState('')
  const [statusFilter,setStatus] = useState('')
  const [deptFilter,setDept] = useState('')
  const [showForm,setShowForm]   = useState(false)
  const [editTarget,setEdit]     = useState(null)
  const [deleteTarget,setDelete] = useState(null)
  const departments = getDepartments(employees)
  const filtered = filterEmployees(employees,search,statusFilter,deptFilter)
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="HR" subtitle={`${employees.length} karyawan`} onRefresh={reload} isRefreshing={isLoading}/>
      <div className="flex-1 p-6 flex flex-col gap-5">
        {error && <Alert type="error" message={error}/>}
        <HrStatCards summary={summary} isLoading={isLoading}/>
        <div className="flex gap-1 border-b border-surface-border">
          {TABS.map(tab=>(
            <button key={tab} onClick={()=>setTab(tab)} className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${activeTab===tab?'border-brand-600 text-brand-600':'border-transparent text-ink-muted hover:text-ink'}`}>{tab}</button>
          ))}
        </div>
        {activeTab==='Karyawan' && <>
          <div className="flex flex-wrap gap-2 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <CrmSearchBar value={search} onChange={setSearch} placeholder="Cari karyawan…" className="w-56"/>
              <select value={statusFilter} onChange={e=>setStatus(e.target.value)} className={sel}><option value="">Semua status</option>{EMPLOYEE_STATUSES.map(s=><option key={s} value={s} className="capitalize">{s.replace('_',' ')}</option>)}</select>
              {departments.length>0&&<select value={deptFilter} onChange={e=>setDept(e.target.value)} className={sel}><option value="">Semua departemen</option>{departments.map(d=><option key={d} value={d}>{d}</option>)}</select>}
            </div>
            <div className="flex gap-2 items-center">
              <ExportImportBar data={filtered} columns={EMPLOYEE_COLUMNS} filename="employees" onImport={importRows}/>
              <Button size="sm" leftIcon={<Plus className="w-4 h-4"/>} onClick={()=>setShowForm(true)}>Tambah karyawan</Button>
            </div>
          </div>
          <div className="bg-white border border-surface-border rounded-xl shadow-card overflow-hidden"><EmployeeTable employees={filtered} isLoading={isLoading} onEdit={setEdit} onDelete={setDelete}/></div>
        </>}
        {activeTab==='Pengajuan Cuti' && <div className="bg-white border border-surface-border rounded-xl shadow-card overflow-hidden"><LeaveTable leaves={leaveRequests} isLoading={leaveLoading} onApprove={approve} onReject={reject} onDelete={removeLeave} showEmployee/></div>}
      </div>
      {showForm && <div className={modal}><div className={modalBox}><h2 className="text-sm font-bold text-ink mb-5">Tambah Karyawan</h2><EmployeeForm onSubmit={async d=>{await create(d);setShowForm(false)}} onCancel={()=>setShowForm(false)} saving={saving}/></div></div>}
      {editTarget && <div className={modal}><div className={modalBox}><h2 className="text-sm font-bold text-ink mb-5">Edit Karyawan</h2><EmployeeForm initial={editTarget} onSubmit={async d=>{await update(editTarget.id,d);setEdit(null)}} onCancel={()=>setEdit(null)} saving={saving}/></div></div>}
      {deleteTarget && <DeleteConfirmModal title="Hapus karyawan" description={`"${deleteTarget.full_name}" akan dihapus permanen.`} onConfirm={async()=>{await remove(deleteTarget.id);setDelete(null)}} onCancel={()=>setDelete(null)} isLoading={saving}/>}
    </div>
  )
}
