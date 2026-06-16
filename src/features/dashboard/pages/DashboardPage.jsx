import StatsGrid    from '../components/StatsGrid.jsx'
import RevenueChart from '../components/RevenueChart.jsx'
import LeadsChart   from '../components/LeadsChart.jsx'
import Topbar       from '../../../shared/components/ui/Topbar.jsx'
import Alert        from '../../../shared/components/ui/Alert.jsx'
import { useDashboard } from '../hooks/useDashboard.js'

export default function DashboardPage() {
  const { stats, revenueTrend, leadsPipeline, isLoading, error, refresh } = useDashboard()
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Dashboard" subtitle="Ringkasan bisnis Anda" onRefresh={refresh} isRefreshing={isLoading} />
      <div className="flex-1 p-6 flex flex-col gap-5">
        {error && <Alert type="error" title="Gagal memuat data" message={error} />}
        <StatsGrid stats={stats} isLoading={isLoading} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RevenueChart data={revenueTrend}  isLoading={isLoading} />
          <LeadsChart   data={leadsPipeline} isLoading={isLoading} />
        </div>
      </div>
    </div>
  )
}
