import { useState } from 'react'
import { Plus } from 'lucide-react'
import Topbar             from '../../../shared/components/ui/Topbar.jsx'
import Button             from '../../../shared/components/ui/Button.jsx'
import Alert              from '../../../shared/components/ui/Alert.jsx'
import CustomerTable      from '../components/customers/CustomerTable.jsx'
import CustomerForm       from '../components/customers/CustomerForm.jsx'
import DeleteConfirmModal from '../components/shared/DeleteConfirmModal.jsx'
import CrmSearchBar       from '../components/shared/CrmSearchBar.jsx'
import ExportImportBar    from '../../../shared/components/ui/ExportImportBar.jsx'
import { useCustomers }   from '../hooks/useCustomers.js'
import { filterCustomers, CUSTOMER_STATUSES } from '../utils/crmHelpers.js'

const CUSTOMER_COLUMNS = [
  { key:'name', label:'Nama' },
  { key:'email', label:'Email' },
  { key:'phone', label:'Telepon' },
  { key:'company', label:'Perusahaan' },
  { key:'address', label:'Alamat' },
  { key:'status', label:'Status' },
  { key:'notes', label:'Catatan' },
]

const sel = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"
const modal = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
const modalBox = "bg-white rounded-2xl shadow-modal border border-surface-border w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up"

export default function CustomersPage() {
  const { customers, isLoading, saving, error, load, create, update, remove, importRows } = useCustomers()
  const [search,setSearch] = useState('')
  const [statusFilter,setStatus] = useState('')
  const [showForm,setShowForm] = useState(false)
  const [editTarget,setEditTarget] = useState(null)
  const [deleteTarget,setDelete] = useState(null)

  const filtered = filterCustomers(customers, search, statusFilter)

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Customers" subtitle={`${customers.length} customer`} onRefresh={load} isRefreshing={isLoading}/>
      <div className="flex-1 p-6 flex flex-col gap-4">
        {error && <Alert type="error" message={error}/>}
        <div className="flex flex-wrap gap-3 items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <CrmSearchBar value={search} onChange={setSearch} placeholder="Cari customer…" className="w-64"/>
            <select value={statusFilter} onChange={e=>setStatus(e.target.value)} className={sel}>
              <option value="">Semua status</option>
              {CUSTOMER_STATUSES.map(s=><option key={s} value={s} className="capitalize">{s}</option>)}
            </select>
          </div>
          <div className="flex gap-2 items-center">
            <ExportImportBar data={filtered} columns={CUSTOMER_COLUMNS} filename="customers" onImport={importRows}/>
            <Button size="sm" leftIcon={<Plus className="w-4 h-4"/>} onClick={()=>setShowForm(true)}>Tambah customer</Button>
          </div>
        </div>
        <div className="bg-white border border-surface-border rounded-xl shadow-card overflow-hidden">
          <CustomerTable customers={filtered} isLoading={isLoading} onEdit={setEditTarget} onDelete={setDelete}/>
        </div>
      </div>

      {showForm && <div className={modal}><div className={modalBox}>
        <h2 className="text-sm font-bold text-ink mb-5">Customer Baru</h2>
        <CustomerForm onSubmit={async d=>{await create(d);setShowForm(false)}} onCancel={()=>setShowForm(false)} saving={saving}/>
      </div></div>}

      {editTarget && <div className={modal}><div className={modalBox}>
        <h2 className="text-sm font-bold text-ink mb-5">Edit Customer</h2>
        <CustomerForm initial={editTarget} onSubmit={async d=>{await update(editTarget.id,d);setEditTarget(null)}} onCancel={()=>setEditTarget(null)} saving={saving}/>
      </div></div>}

      {deleteTarget && <DeleteConfirmModal title="Hapus customer" description={`"${deleteTarget.name}" akan dihapus permanen.`}
        onConfirm={async()=>{await remove(deleteTarget.id);setDelete(null)}} onCancel={()=>setDelete(null)} isLoading={saving}/>}
    </div>
  )
}
