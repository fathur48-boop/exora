import { BarChart,Bar,XAxis,YAxis,CartesianGrid,Tooltip,ResponsiveContainer,Cell } from 'recharts'
const FUNNEL_COLORS=['#6366f1','#818cf8','#f59e0b','#3b82f6','#8b5cf6','#16a34a','#ef4444']
const STAGE_ORDER=['new','contacted','qualified','proposal','negotiation','closed','lost']
const STAGE_LABELS={new:'New',contacted:'Contacted',qualified:'Qualified',proposal:'Proposal',negotiation:'Negotiation',closed:'Closed',lost:'Lost'}
export default function LeadFunnelChart({ byStage }) {
  if(!byStage)return null
  const data = STAGE_ORDER.map((s,i)=>({label:STAGE_LABELS[s],value:byStage[s]??0,color:FUNNEL_COLORS[i]})).filter(d=>d.value>0)
  return (
    <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card">
      <h3 className="text-sm font-bold text-ink mb-4">Lead Funnel</h3>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{top:4,right:4,left:0,bottom:0}} barSize={24}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false}/>
          <XAxis dataKey="label" tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false}/>
          <YAxis tick={{fontSize:10,fill:'#94a3b8'}} axisLine={false} tickLine={false} allowDecimals={false} width={24}/>
          <Tooltip cursor={{fill:'#f8fafc'}}/>
          <Bar dataKey="value" radius={[4,4,0,0]}>{data.map(d=><Cell key={d.label} fill={d.color}/>)}</Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
