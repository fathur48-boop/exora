import { useState, useMemo } from 'react'
import { Plus }           from 'lucide-react'
import Topbar             from '../../../shared/components/ui/Topbar.jsx'
import Button             from '../../../shared/components/ui/Button.jsx'
import Alert              from '../../../shared/components/ui/Alert.jsx'
import FinanceStatCards   from '../components/shared/FinanceStatCards.jsx'
import FinanceChart       from '../components/shared/FinanceChart.jsx'
import TransactionTable   from '../components/transactions/TransactionTable.jsx'
import TransactionForm    from '../components/transactions/TransactionForm.jsx'
import DeleteConfirmModal from '../../crm/components/shared/DeleteConfirmModal.jsx'
import CrmSearchBar       from '../../crm/components/shared/CrmSearchBar.jsx'
import ExportImportBar    from '../../../shared/components/ui/ExportImportBar.jsx'
import { useTransactions } from '../hooks/useTransactions.js'
import { filterTransactions,TRANSACTION_TYPES,TRANSACTION_STATUSES } from '../utils/financeHelpers.js'

const TRANSACTION_COLUMNS = [
  { key:'type', label:'Tipe' },
  { key:'amount', label:'Jumlah' },
  { key:'category', label:'Kategori' },
  { key:'description', label:'Deskripsi' },
  { key:'reference', label:'Referensi' },
  { key:'payment_method', label:'Metode Bayar' },
  { key:'status', label:'Status' },
  { key:'contact_name', label:'Kontak' },
  { key:'date', label:'Tanggal' },
  { key:'notes', label:'Catatan' },
]

const modal    = "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
const modalBox = "bg-white rounded-2xl shadow-modal border border-surface-border w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto animate-slide-up"
const sel      = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"

const currentYear = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: currentYear - 2019 }, (_, i) => currentYear - i)

export default function FinancePage() {
  const { transactions,summary,isLoading,saving,error,reload,create,update,remove,importRows } = useTransactions()
  const [search,setSearch]       = useState('')
  const [typeFilter,setType]     = useState('')
  const [statusFilter,setStatus] = useState('')
  const [dateFrom,setFrom]       = useState('')
  const [dateTo,setTo]           = useState('')
  const [chartYear,setChartYear] = useState(String(currentYear))
  const [showForm,setShowForm]   = useState(false)
  const [editTarget,setEdit]     = useState(null)
  const [deleteTarget,setDelete] = useState(null)

  const filtered = filterTransactions(transactions,{search,type:typeFilter,status:statusFilter,dateFrom,dateTo})

  // Gunakan logika SAMA persis dengan ReportsService.getRevenueReport() / reportsAggregation.js
  // Exclude unpaid, hitung per bulan dari transactions yang sudah di-fetch (full dataset, .limit(10000))
  const chartTrend = useMemo(() => {
    if (!transactions.length) return summary?.trend ?? []
    const year = parseInt(chartYear)
    const income  = transactions.filter(t => t.type === 'income'  && t.status !== 'unpaid')
    const expense = transactions.filter(t => t.type === 'expense' && t.status !== 'unpaid')
    const result = []
    for (let m = 0; m < 12; m++) {
      const label = new Date(year, m, 1).toLocaleString('id-ID', { month: 'short', year: '2-digit' })
      const inc = income.filter(t => {
        const td = new Date(t.date)
        return td.getFullYear() === year && td.getMonth() === m
      }).reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)
      const exp = expense.filter(t => {
        const td = new Date(t.date)
        return td.getFullYear() === year && td.getMonth() === m
      }).reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)
      result.push({ label, income: inc, expense: exp })
    }
    return result
  }, [transactions, chartYear, summary])

  const availableYears = useMemo(() => {
    if (!transactions.length) return YEAR_OPTIONS
    const years = [...new Set(transactions.map(t => new Date(t.date).getFullYear()))].sort((a,b) => b-a)
    return years.length ? years : YEAR_OPTIONS
  }, [transactions])

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Finance" subtitle={`${transactions.length} transaksi`} onRefresh={reload} isRefreshing={isLoading}/>
      <div className="flex-1 p-6 flex flex-col gap-5">
        {error && <Alert type="error" message={error}/>}
        <FinanceStatCards summary={summary} isLoading={isLoading}/>
        <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div><h3 className="text-sm font-bold text-ink">Tren Keuangan</h3><p className="text-2xs text-ink-faint mt-0.5">12 bulan dalam tahun dipilih</p></div>
            <select value={chartYear} onChange={e=>setChartYear(e.target.value)} className={sel + " w-28"}>
              {availableYears.map(y=><option key={y} value={String(y)}>{y}</option>)}
            </select>
          </div>
          <FinanceChart trend={chartTrend} isLoading={isLoading && !summary}/>
        </div>
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <CrmSearchBar value={search} onChange={setSearch} placeholder="Cari transaksi…" className="w-56"/>
            <select value={typeFilter}   onChange={e=>setType(e.target.value)}   className={sel}><option value="">Semua tipe</option>{TRANSACTION_TYPES.map(t=><option key={t} value={t} className="capitalize">{t}</option>)}</select>
            <select value={statusFilter} onChange={e=>setStatus(e.target.value)} className={sel}><option value="">Semua status</option>{TRANSACTION_STATUSES.map(s=><option key={s} value={s} className="capitalize">{s}</option>)}</select>
            <input type="date" value={dateFrom} onChange={e=>setFrom(e.target.value)} className={sel}/>
            <input type="date" value={dateTo}   onChange={e=>setTo(e.target.value)}   className={sel}/>
          </div>
          <div className="flex gap-2 items-center">
            <ExportImportBar data={filtered} columns={TRANSACTION_COLUMNS} filename="transactions" onImport={importRows}/>
            <Button size="sm" leftIcon={<Plus className="w-4 h-4"/>} onClick={()=>setShowForm(true)}>Tambah transaksi</Button>
          </div>
        </div>
        <div className="bg-white border border-surface-border rounded-xl shadow-card overflow-hidden">
          <TransactionTable transactions={filtered} isLoading={isLoading} onEdit={setEdit} onDelete={setDelete}/>
        </div>
      </div>
      {showForm && <div className={modal}><div className={modalBox}><h2 className="text-sm font-bold text-ink mb-5">Tambah Transaksi</h2><TransactionForm onSubmit={async d=>{await create(d);setShowForm(false)}} onCancel={()=>setShowForm(false)} saving={saving}/></div></div>}
      {editTarget && <div className={modal}><div className={modalBox}><h2 className="text-sm font-bold text-ink mb-5">Edit Transaksi</h2><TransactionForm initial={editTarget} onSubmit={async d=>{await update(editTarget.id,d);setEdit(null)}} onCancel={()=>setEdit(null)} saving={saving}/></div></div>}
      {deleteTarget && <DeleteConfirmModal title="Hapus transaksi" description={`"${deleteTarget.description}" akan dihapus permanen.`} onConfirm={async()=>{await remove(deleteTarget.id);setDelete(null)}} onCancel={()=>setDelete(null)} isLoading={saving}/>}
    </div>
  )
}
