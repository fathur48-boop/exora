import { useState } from 'react'
import Topbar from '../../../shared/components/ui/Topbar.jsx'
import Alert from '../../../shared/components/ui/Alert.jsx'
import SalesHistoryTable from '../components/history/SalesHistoryTable.jsx'
import SaleDetailModal from '../components/history/SaleDetailModal.jsx'
import PosSummaryCards from '../components/history/PosSummaryCards.jsx'
import { useSalesHistory } from '../hooks/useSalesHistory.js'
import { fetchPosSummary } from '../services/posService.js'
import { useEffect } from 'react'

const sel = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"

export default function PosHistoryPage() {
  const { sales, isLoading, saving, dateFrom, dateTo, setDateFrom, setDateTo, reload, getDetail, refund } = useSalesHistory()
  const [detailSale,    setDetailSale]    = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [summary,       setSummary]       = useState(null)
  const [confirmRefund, setConfirmRefund] = useState(null)
  const today = new Date().toISOString().slice(0,10)

  useEffect(() => {
    fetchPosSummary(today).then(setSummary).catch(()=>{})
  }, [sales])

  const handleView = async (id) => {
    setDetailLoading(true)
    setDetailSale({})
    const s = await getDetail(id)
    setDetailSale(s)
    setDetailLoading(false)
  }

  const handleRefund = async (id) => {
    if (!window.confirm('Yakin ingin refund transaksi ini? Stok akan dikembalikan.')) return
    await refund(id)
  }

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Riwayat Penjualan" subtitle={`${sales.length} transaksi`} onRefresh={reload} isRefreshing={isLoading}/>
      <div className="flex-1 p-6 flex flex-col gap-5">
        <PosSummaryCards summary={summary}/>
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-ink-muted">Dari:</label>
            <input type="date" value={dateFrom} onChange={e=>setDateFrom(e.target.value)} className={sel}/>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-ink-muted">Sampai:</label>
            <input type="date" value={dateTo} onChange={e=>setDateTo(e.target.value)} className={sel}/>
          </div>
        </div>
        <div className="bg-white border border-surface-border rounded-xl shadow-card overflow-hidden">
          <SalesHistoryTable sales={sales} isLoading={isLoading} onView={handleView} onRefund={handleRefund}/>
        </div>
      </div>
      {detailSale !== null && (
        <SaleDetailModal sale={detailSale} isLoading={detailLoading} onClose={()=>setDetailSale(null)}/>
      )}
    </div>
  )
}
