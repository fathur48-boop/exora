import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import Spinner from '../../../shared/components/ui/Spinner.jsx'

const STAGE_COLORS = { New:'#6366f1', Contacted:'#8b5cf6', Qualified:'#f59e0b', Proposal:'#3b82f6', Negotiation:'#f97316', Closed:'#16a34a', Lost:'#ef4444' }

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-surface-border rounded-xl px-3 py-2 shadow-modal text-xs">
      <p className="text-ink-muted mb-1 font-medium">{label}</p>
      <p className="font-bold text-ink">{payload[0].value} leads</p>
    </div>
  )
}

export default function LeadsChart({ data, isLoading }) {
  return (
    <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card">
      <div className="mb-4">
        <h3 className="text-sm font-bold text-ink">Leads Pipeline</h3>
        <p className="text-2xs text-ink-faint mt-0.5">Per stage</p>
      </div>
      {isLoading ? (
        <div className="h-48 flex items-center justify-center"><Spinner size="lg" className="text-ink-faint" /></div>
      ) : (
        <ResponsiveContainer width="100%" height={192}>
          <BarChart data={data} margin={{ top:4, right:4, left:0, bottom:0 }} barSize={22}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
            <XAxis dataKey="label" tick={{ fontSize:10, fill:'#94a3b8' }} axisLine={false} tickLine={false}/>
            <YAxis tick={{ fontSize:11, fill:'#94a3b8' }} axisLine={false} tickLine={false} allowDecimals={false} width={24}/>
            <Tooltip content={<CustomTooltip />} cursor={{ fill:'#f8fafc' }}/>
            <Bar dataKey="value" radius={[5,5,0,0]}>
              {data?.map(entry => <Cell key={entry.label} fill={STAGE_COLORS[entry.label]??'#6366f1'}/>)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
