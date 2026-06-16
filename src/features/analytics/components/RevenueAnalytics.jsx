import { AreaChart,Area,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer } from 'recharts'
import { formatCurrencyShort } from '../../reports/utils/reportsHelpers.js'
export default function RevenueAnalytics({ trend }) {
  if(!trend?.length)return null
  return (
    <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card">
      <h3 className="text-sm font-bold text-ink mb-4">Profit Trend — 12 Bulan</h3>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={trend} margin={{top:4,right:4,left:0,bottom:0}}>
          <defs>
            <linearGradient id="profitGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/><stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/></linearGradient>
            <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#16a34a" stopOpacity={0.1}/><stop offset="95%" stopColor="#16a34a" stopOpacity={0}/></linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
          <XAxis dataKey="label" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
          <YAxis tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false} width={40} tickFormatter={v=>v>=1_000_000?(v/1_000_000).toFixed(0)+'M':v>=1_000?(v/1_000).toFixed(0)+'K':v}/>
          <Tooltip formatter={(v,name)=>[formatCurrencyShort(v),name]} contentStyle={{fontSize:11,border:'1px solid #e2e8f0',borderRadius:8}}/>
          <Area type="monotone" dataKey="income" name="Income" stroke="#16a34a" strokeWidth={1.5} fill="url(#incomeGrad)" dot={false}/>
          <Area type="monotone" dataKey="profit" name="Profit" stroke="#4f46e5" strokeWidth={2} fill="url(#profitGrad)" dot={false}/>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
