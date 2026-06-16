import Topbar             from '../../../shared/components/ui/Topbar.jsx'
import Alert              from '../../../shared/components/ui/Alert.jsx'
import Spinner            from '../../../shared/components/ui/Spinner.jsx'
import KpiCards           from '../components/KpiCards.jsx'
import RevenueAnalytics   from '../components/RevenueAnalytics.jsx'
import CustomerAnalytics  from '../components/CustomerAnalytics.jsx'
import LeadFunnelChart    from '../components/LeadFunnelChart.jsx'
import PerformanceSummary from '../components/PerformanceSummary.jsx'
import { useAnalytics }   from '../hooks/useAnalytics.js'
export default function AnalyticsPage() {
  const { analytics,isLoading,error,reload } = useAnalytics()
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Analytics" subtitle="Business intelligence overview" onRefresh={reload} isRefreshing={isLoading}/>
      <div className="flex-1 p-6 flex flex-col gap-5">
        {error && <Alert type="error" message={error}/>}
        {isLoading && !analytics ? <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
        : <>
            <KpiCards data={analytics}/>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <RevenueAnalytics trend={analytics?.revenue?.monthly_trend}/>
              <LeadFunnelChart byStage={analytics?.leads?.by_stage}/>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <CustomerAnalytics leadsData={analytics?.leads}/>
              <PerformanceSummary data={analytics}/>
            </div>
          </>}
      </div>
    </div>
  )
}
