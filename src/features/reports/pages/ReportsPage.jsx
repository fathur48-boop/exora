import { useState } from 'react'
import Topbar          from '../../../shared/components/ui/Topbar.jsx'
import Alert           from '../../../shared/components/ui/Alert.jsx'
import Spinner         from '../../../shared/components/ui/Spinner.jsx'
import RevenueReport   from '../components/RevenueReport.jsx'
import LeadsReport     from '../components/LeadsReport.jsx'
import InventoryReport from '../components/InventoryReport.jsx'
import HrReport        from '../components/HrReport.jsx'
import ProjectsReport  from '../components/ProjectsReport.jsx'
import { useReports }  from '../hooks/useReports.js'
const TABS=[{key:'revenue',label:'Revenue'},{key:'leads',label:'Leads'},{key:'inventory',label:'Inventory'},{key:'hr',label:'HR'},{key:'projects',label:'Projects'}]
export default function ReportsPage() {
  const { report,isLoading,error,reload } = useReports()
  const [activeTab,setTab] = useState('revenue')
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Reports" subtitle={report?`Terakhir diperbarui: ${new Date(report.generated_at).toLocaleTimeString('id-ID')}`:'Laporan bisnis'} onRefresh={reload} isRefreshing={isLoading}/>
      <div className="flex-1 p-6 flex flex-col gap-5">
        {error && <Alert type="error" message={error}/>}
        <div className="flex gap-1 border-b border-surface-border overflow-x-auto scrollbar-thin">
          {TABS.map(tab=><button key={tab.key} onClick={()=>setTab(tab.key)} className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px whitespace-nowrap ${activeTab===tab.key?'border-brand-600 text-brand-600':'border-transparent text-ink-muted hover:text-ink'}`}>{tab.label}</button>)}
        </div>
        {isLoading && !report ? <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
        : <>
            {activeTab==='revenue'   && <RevenueReport   data={report?.revenue}   isLoading={isLoading}/>}
            {activeTab==='leads'     && <LeadsReport     data={report?.leads}     isLoading={isLoading}/>}
            {activeTab==='inventory' && <InventoryReport data={report?.inventory} isLoading={isLoading}/>}
            {activeTab==='hr'        && <HrReport        data={report?.hr}        isLoading={isLoading}/>}
            {activeTab==='projects'  && <ProjectsReport  data={report?.projects}  isLoading={isLoading}/>}
          </>}
      </div>
    </div>
  )
}
