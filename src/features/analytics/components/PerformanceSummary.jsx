import { formatCurrencyShort } from '../../reports/utils/reportsHelpers.js'
import { cn } from '../../../shared/utils/cn.js'
export default function PerformanceSummary({ data }) {
  if(!data)return null
  const rows=[
    {module:'Finance', metrics:[{label:'Net Profit',value:formatCurrencyShort(data.revenue?.net_profit??0),ok:(data.revenue?.net_profit??0)>=0},{label:'Profit Margin',value:(data.revenue?.profit_margin??0)+'%',ok:(data.revenue?.profit_margin??0)>=20}]},
    {module:'CRM',     metrics:[{label:'Total Leads',value:String(data.leads?.total??0),ok:true},{label:'Conversion',value:(data.leads?.conversion_rate??0)+'%',ok:(data.leads?.conversion_rate??0)>=20}]},
    {module:'Inventory',metrics:[{label:'Stok Habis',value:String(data.inventory?.out_of_stock??0),ok:(data.inventory?.out_of_stock??0)===0},{label:'Stok Menipis',value:String(data.inventory?.low_stock??0),ok:(data.inventory?.low_stock??0)===0}]},
    {module:'Projects', metrics:[{label:'Active',value:String(data.projects?.by_status?.active??0),ok:true},{label:'Overdue',value:String(data.projects?.overdue??0),ok:(data.projects?.overdue??0)===0}]},
    {module:'HR',       metrics:[{label:'Karyawan Aktif',value:String(data.hr?.active??0),ok:true},{label:'Total Gaji/Bln',value:formatCurrencyShort(data.hr?.total_salary??0),ok:true}]},
  ]
  return (
    <div className="bg-white border border-surface-border rounded-xl shadow-card overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-border"><h3 className="text-sm font-bold text-ink">Performance Summary</h3></div>
      <div className="divide-y divide-surface-border">
        {rows.map(row=>(
          <div key={row.module} className="flex items-center px-5 py-3 gap-4">
            <p className="text-xs font-bold text-ink w-20 shrink-0">{row.module}</p>
            <div className="flex flex-wrap gap-4 flex-1">
              {row.metrics.map(m=>(
                <div key={m.label} className="flex items-center gap-2">
                  <span className={cn('w-2 h-2 rounded-full shrink-0',m.ok?'bg-green-500':'bg-red-500')}/>
                  <span className="text-2xs text-ink-faint font-medium">{m.label}:</span>
                  <span className={cn('text-2xs font-bold',m.ok?'text-ink':'text-red-600')}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
