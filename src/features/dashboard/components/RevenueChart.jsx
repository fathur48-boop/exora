import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../utils/dashboardHelpers.js'
import Spinner from '../../../shared/components/ui/Spinner.jsx'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-surface-border rounded-xl px-3 py-2 shadow-modal text-xs">
      <p className="text-ink-muted mb-1 font-medium">{label}</p>
      <p className="font-bold text-brand-600">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

export default function RevenueChart({ data, isLoading }) {
  return (
    <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-ink">Revenue Trend</h3>
        <p className="text-2xs text-ink-faint mt-0.5">7 hari terakhir</p>
      </div>
      {isLoading ? (
        <div className="h-48 flex items-center justify-center"><Spinner size="lg" className="text-ink-faint" /></div>
      ) : (
        <ResponsiveContainer width="100%" height={192}>
          <AreaChart data={data} margin={{ top:4, right:4, left:0, bottom:0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#4f46e5" stopOpacity={0.2}/>
                <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="label" tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false}
              tickFormatter={v => v>=1_000_000?(v/1_000_000).toFixed(0)+'M':v>=1_000?(v/1_000).toFixed(0)+'K':v} width={40}/>
            <Tooltip content={<CustomTooltip />}/>
            <Area type="monotone" dataKey="value" stroke="#4f46e5" strokeWidth={2.5}
              fill="url(#revGrad)" dot={false} activeDot={{ r:5, fill:'#4f46e5', strokeWidth:2, stroke:'#fff' }}/>
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
