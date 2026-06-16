import { PieChart,Pie,Cell,Tooltip,ResponsiveContainer } from 'recharts'
import Spinner from '../../../shared/components/ui/Spinner.jsx'
import { formatCurrencyShort } from '../utils/reportsHelpers.js'
const PIE_COLORS=['#4f46e5','#16a34a','#f59e0b','#ec4899','#8b5cf6','#06b6d4','#f97316','#64748b']
export default function InventoryReport({ data,isLoading }) {
  if(isLoading)return <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
  if(!data)return null
  const categoryData = Object.entries(data.by_category||{}).map(([k,v])=>({label:k,value:v}))
  const kpis=[
    {label:'Total Produk', value:String(data.total_products),               color:'text-brand-600'},
    {label:'Nilai Stok',   value:formatCurrencyShort(data.total_value),     color:'text-green-600'},
    {label:'Stok Menipis', value:String(data.low_stock),                    color:'text-amber-600'},
    {label:'Stok Habis',   value:String(data.out_of_stock),                 color:'text-red-600'},
  ]
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">{kpis.map(k=><div key={k.label} className="bg-white border border-surface-border rounded-xl p-4 shadow-card"><p className="text-2xs text-ink-faint mb-1 font-medium uppercase tracking-wide">{k.label}</p><p className={`text-base font-bold ${k.color}`}>{k.value}</p></div>)}</div>
      {categoryData.length>0&&<div className="bg-white border border-surface-border rounded-xl p-5 shadow-card">
        <h4 className="text-sm font-bold text-ink mb-4">Stok by Kategori</h4>
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <ResponsiveContainer width={180} height={180}><PieChart><Pie data={categoryData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={80} innerRadius={45}>{categoryData.map((_,i)=><Cell key={i} fill={PIE_COLORS[i%PIE_COLORS.length]}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer>
          <div className="flex flex-col gap-2 flex-1">{categoryData.map((d,i)=><div key={d.label} className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full shrink-0" style={{background:PIE_COLORS[i%PIE_COLORS.length]}}/><span className="text-xs text-ink font-medium">{d.label}</span></div><span className="text-xs font-bold text-ink">{Number(d.value).toLocaleString('id-ID')} unit</span></div>)}</div>
        </div>
      </div>}
    </div>
  )
}
