import { BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Cell } from 'recharts'
import Spinner from '../../../shared/components/ui/Spinner.jsx'
import { formatCurrencyShort } from '../utils/reportsHelpers.js'
const STAGE_COLORS={new:'#6366f1',contacted:'#818cf8',qualified:'#f59e0b',proposal:'#3b82f6',negotiation:'#8b5cf6',closed:'#16a34a',lost:'#ef4444'}
const SOURCE_LABELS={website:'Website',referral:'Referral',social:'Social Media',cold_call:'Cold Call',other:'Other'}
export default function LeadsReport({ data,isLoading }) {
  if(isLoading)return <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
  if(!data)return null
  const stageData  = Object.entries(data.by_stage||{}).map(([k,v])=>({label:k.charAt(0).toUpperCase()+k.slice(1),value:v,key:k}))
  const sourceData = Object.entries(data.by_source||{}).map(([k,v])=>({label:SOURCE_LABELS[k]??k,value:v}))
  const kpis=[
    {label:'Total Leads',     value:String(data.total)},
    {label:'Conversion Rate', value:data.conversion_rate+'%'},
    {label:'Total Pipeline',  value:formatCurrencyShort(data.total_value)},
    {label:'Closed Value',    value:formatCurrencyShort(data.closed_value)},
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{kpis.map(k=><div key={k.label} className="bg-white border border-surface-border rounded-xl p-4 shadow-card"><p className="text-2xs text-ink-faint mb-1 font-medium uppercase tracking-wide">{k.label}</p><p className="text-base font-bold text-ink">{k.value}</p></div>)}</div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card">
          <h4 className="text-sm font-bold text-ink mb-4">Leads by Stage</h4>
          <ResponsiveContainer width="100%" height={180}><BarChart data={stageData} margin={{top:4,right:4,left:0,bottom:0}} barSize={20}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/><XAxis dataKey="label" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/><YAxis tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false} allowDecimals={false} width={24}/><Tooltip cursor={{fill:'#f8fafc'}}/><Bar dataKey="value" radius={[4,4,0,0]}>{stageData.map(d=><Cell key={d.key} fill={STAGE_COLORS[d.key]??'#6366f1'}/>)}</Bar></BarChart></ResponsiveContainer>
        </div>
        <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card">
          <h4 className="text-sm font-bold text-ink mb-4">Leads by Source</h4>
          <ResponsiveContainer width="100%" height={180}><BarChart data={sourceData} layout="vertical" margin={{top:4,right:16,left:0,bottom:0}} barSize={14}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/><XAxis type="number" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false} allowDecimals={false}/><YAxis type="category" dataKey="label" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false} width={72}/><Tooltip cursor={{fill:'#f8fafc'}}/><Bar dataKey="value" fill="#4f46e5" radius={[0,4,4,0]}/></BarChart></ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
