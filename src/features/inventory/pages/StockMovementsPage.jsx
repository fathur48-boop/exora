import Topbar            from '../../../shared/components/ui/Topbar.jsx'
import MovementTable     from '../components/stock/MovementTable.jsx'
import { useStockMovements } from '../hooks/useStockMovements.js'
export default function StockMovementsPage() {
  const { movements,isLoading,reload } = useStockMovements(null)
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Riwayat Stok" subtitle={`${movements.length} transaksi`} onRefresh={reload} isRefreshing={isLoading}/>
      <div className="flex-1 p-6">
        <div className="bg-white border border-surface-border rounded-xl shadow-card overflow-hidden">
          <MovementTable movements={movements} isLoading={isLoading}/>
        </div>
      </div>
    </div>
  )
}
