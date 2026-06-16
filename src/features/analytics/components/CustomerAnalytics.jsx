export default function CustomerAnalytics({ leadsData }) {
  if(!leadsData)return null
  const convRate=leadsData?.conversion_rate??0
  return (
    <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card">
      <h3 className="text-sm font-bold text-ink mb-4">Sales & Pipeline</h3>
      <div className="flex flex-col gap-4">
        <div>
          <div className="flex justify-between mb-1.5"><p className="text-xs text-ink-muted font-medium">Conversion Rate</p><p className="text-xs font-bold text-ink">{convRate}%</p></div>
          <div className="h-2 bg-surface-subtle rounded-full overflow-hidden"><div className="h-full rounded-full" style={{width:`${convRate}%`,background:convRate>=50?'#16a34a':convRate>=25?'#d97706':'#dc2626'}}/></div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {[['Total Leads',leadsData?.total??0,'text-ink'],['Closed Leads',leadsData?.by_stage?.closed??0,'text-green-600'],['Lost Leads',leadsData?.by_stage?.lost??0,'text-red-600'],['In Pipeline',leadsData?.by_stage?.proposal??0,'text-brand-600']].map(([label,value,color])=>(
            <div key={label} className="bg-surface-subtle rounded-xl p-3"><p className="text-2xs text-ink-faint font-medium uppercase tracking-wide">{label}</p><p className={`text-base font-bold mt-0.5 ${color}`}>{value}</p></div>
          ))}
        </div>
      </div>
    </div>
  )
}
