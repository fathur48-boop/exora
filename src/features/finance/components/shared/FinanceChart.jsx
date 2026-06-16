import { BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Legend } from 'recharts'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
import Spinner from '../../../../shared/components/ui/Spinner.jsx'
function CustomTooltip({ active,payload,label }) {
  if(!active||!payload?.length)return null
  return <div className="bg-white border border-surface-border rounded-xl px-3 py-2 shadow-modal text-xs">
    <p className="text-ink-muted font-semibold mb-2">{label}</p>
    {payload.map(p=><div key={p.name} className="flex items-center gap-2 mb-1"><span className="w-2 h-2 rounded-full" style={{background:p.color}}/><span className="text-ink-muted capitalize">{p.name}:</span><span className="font-bold text-ink">{formatCurrency(p.value)}</span></div>)}
  </div>
}
export default function FinanceChart({ trend,isLoading }) {
  return (
    <div className="bg-white">
      {isLoading ? <div className="h-52 flex items-center justify-center"><Spinner size="lg" className="text-ink-faint"/></div>
      : <ResponsiveContainer width="100%" height={208}>
          <BarChart data={trend} margin={{top:4,right:4,left:0,bottom:0}} barSize={14} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="label" tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
            <YAxis tick={{fontSize:11,fill:'#94a3b8'}} axisLine={false} tickLine={false} width={44}
              tickFormatter={v=>v>=1_000_000?(v/1_000_000).toFixed(0)+'M':v>=1_000?(v/1_000).toFixed(0)+'K':v}/>
            <Tooltip content={<CustomTooltip/>} cursor={{fill:'#f8fafc'}}/>
            <Legend iconType="circle" iconSize={8} wrapperStyle={{fontSize:'11px',paddingTop:'12px'}}/>
            <Bar dataKey="income"  name="Income"  fill="#16a34a" radius={[4,4,0,0]}/>
            <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4,4,0,0]}/>
          </BarChart>
        </ResponsiveContainer>}
    </div>
  )
}
