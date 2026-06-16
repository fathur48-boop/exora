import { TrendingUp,TrendingDown,Minus } from 'lucide-react'
import { formatCurrency } from '../../dashboard/utils/dashboardHelpers.js'
import { calcKpi,getLastTwoMonths } from '../utils/analyticsHelpers.js'
import { cn } from '../../../shared/utils/cn.js'
function KpiCard({ title,value,kpi,prefix='' }) {
  const Icon = kpi?.direction==='up'?TrendingUp:kpi?.direction==='down'?TrendingDown:Minus
  const color= kpi?.direction==='up'?'text-green-600':kpi?.direction==='down'?'text-red-600':'text-ink-faint'
  return (
    <div className="bg-white border border-surface-border rounded-xl p-5 shadow-card stat-card">
      <p className="text-2xs text-ink-faint mb-2 font-medium uppercase tracking-wide">{title}</p>
      <p className="text-xl font-extrabold text-ink tracking-tight">{prefix}{value}</p>
      {kpi?.pct&&<div className={cn('flex items-center gap-1 mt-2 text-2xs font-bold',color)}><Icon className="w-3 h-3"/>{kpi.pct}% vs bulan lalu</div>}
    </div>
  )
}
export default function KpiCards({ data }) {
  if(!data)return null
  const { current,previous } = getLastTwoMonths(data.revenue?.monthly_trend)
  const incomeKpi  = current&&previous?calcKpi(current.income,previous.income):null
  const expenseKpi = current&&previous?calcKpi(current.expense,previous.expense):null
  const profitKpi  = current&&previous?calcKpi(current.profit,previous.profit):null
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <KpiCard title="Income Bulan Ini"  value={formatCurrency(data.revenue?.month_income??0)}  kpi={incomeKpi}/>
      <KpiCard title="Expense Bulan Ini" value={formatCurrency(data.revenue?.month_expense??0)} kpi={expenseKpi}/>
      <KpiCard title="Profit Bulan Ini"  value={formatCurrency(data.revenue?.month_profit??0)}  kpi={profitKpi}/>
      <KpiCard title="Conversion Rate"   value={String(data.leads?.conversion_rate??0)+'%'}/>
    </div>
  )
}
