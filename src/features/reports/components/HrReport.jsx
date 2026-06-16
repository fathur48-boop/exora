import { BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer } from 'recharts'
import Spinner from '../../../shared/components/ui/Spinner.jsx'
import { formatCurrencyShort } from '../utils/reportsHelpers.js'
export default function HrReport({ data,isLoading }) {
  if(isLoading)return <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
  if(!data)return null
  const deptData = Object.entries(data.by_department||{}).map(([k,v])=>({label:k,value:v}))
  const kpis=[
    {label:'Total Karyawan',     value:String(data.total)},
    {label:'Aktif',              value:String(data.active)},
    {label:'Total Gaji/Bulan',   value:formatCurrencyShort(data.total_salary)},
    {label:'Rata-rata Gaji',     value:formatCurrencyShort(data.avg_salary)},
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{kpis.map(k=><div key={k.label} className="bg-white border border-surface-border rounded-xl p-4 shadow-card"><p className="text-2xs text-ink-faint mb-1 font-medium uppercase tracking-wide">{k.label}</p><p className="text-base font-bold text-ink">{k.value}</p></div>)}</div>
      {deptData.length>0&&<div className="bg-white border border-surface-border rounded-xl p-5 shadow-card">
        <h4 className="text-sm font-bold text-ink mb-4">Karyawan by Departemen</h4>
        <ResponsiveContainer width="100%" height={200}><BarChart data={deptData} layout="vertical" margin={{top:4,right:16,left:0,bottom:0}} barSize={16}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false}/><XAxis type="number" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false} allowDecimals={false}/><YAxis type="category" dataKey="label" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false} width={90}/><Tooltip cursor={{fill:'#f8fafc'}}/><Bar dataKey="value" fill="#4f46e5" radius={[0,4,4,0]}/></BarChart></ResponsiveContainer>
      </div>}
    </div>
  )
}
