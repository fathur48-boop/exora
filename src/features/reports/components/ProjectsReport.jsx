import { PieChart,Pie,Cell,Tooltip,ResponsiveContainer } from 'recharts'
import Spinner from '../../../shared/components/ui/Spinner.jsx'
import { formatCurrencyShort } from '../utils/reportsHelpers.js'
import { cn } from '../../../shared/utils/cn.js'
const STATUS_COLORS={planning:'#3b82f6',active:'#16a34a',on_hold:'#f59e0b',completed:'#8b5cf6',cancelled:'#9ca3af'}
const STATUS_LABELS={planning:'Planning',active:'Active',on_hold:'On Hold',completed:'Completed',cancelled:'Cancelled'}
export default function ProjectsReport({ data,isLoading }) {
  if(isLoading)return <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
  if(!data)return null
  const statusData = Object.entries(data.by_status||{}).filter(([,v])=>v>0).map(([k,v])=>({label:STATUS_LABELS[k]??k,value:v,key:k}))
  const kpis=[
    {label:'Total Projects', value:String(data.total)},
    {label:'Active',         value:String(data.by_status?.active??0)},
    {label:'Overdue',        value:String(data.overdue), color:data.overdue>0?'text-red-600':'text-ink'},
    {label:'Budget Usage',   value:data.budget_usage+'%', color:data.budget_usage>=90?'text-red-600':data.budget_usage>=70?'text-amber-600':'text-green-600'},
    {label:'Total Budget',   value:formatCurrencyShort(data.total_budget)},
    {label:'Total Spent',    value:formatCurrencyShort(data.total_spent)},
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">{kpis.map(k=><div key={k.label} className="bg-white border border-surface-border rounded-xl p-4 shadow-card"><p className="text-2xs text-ink-faint mb-1 font-medium uppercase tracking-wide">{k.label}</p><p className={cn('text-base font-bold',k.color??'text-ink')}>{k.value}</p></div>)}</div>
      {statusData.length>0&&<div className="bg-white border border-surface-border rounded-xl p-5 shadow-card">
        <h4 className="text-sm font-bold text-ink mb-4">Projects by Status</h4>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ResponsiveContainer width={180} height={180}><PieChart><Pie data={statusData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>{statusData.map(d=><Cell key={d.key} fill={STATUS_COLORS[d.key]??'#6366f1'}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer>
          <div className="flex flex-col gap-2 flex-1">{statusData.map(d=><div key={d.key} className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:STATUS_COLORS[d.key]??'#6366f1'}}/><span className="text-xs text-ink font-medium">{d.label}</span></div><span className="text-xs font-bold text-ink">{d.value}</span></div>)}</div>
        </div>
      </div>}
    </div>
  )
}
