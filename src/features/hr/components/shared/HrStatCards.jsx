import { Users,UserCheck,UserX,Clock } from 'lucide-react'
import StatCard from '../../../dashboard/components/StatCard.jsx'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
export default function HrStatCards({ summary,isLoading }) {
  const cards = [
    { title:'Total Karyawan',     value:String(summary?.total??0), subtitle:'Terdaftar',                                    icon:Users,     iconColor:'text-brand-600',  iconBg:'bg-brand-50'  },
    { title:'Aktif',              value:String(summary?.by_status?.active??0), subtitle:'Karyawan aktif',                   icon:UserCheck, iconColor:'text-green-600',  iconBg:'bg-green-50'  },
    { title:'Cuti / Nonaktif',    value:String((summary?.by_status?.on_leave??0)+(summary?.by_status?.inactive??0)), subtitle:`${summary?.by_status?.on_leave??0} cuti · ${summary?.by_status?.inactive??0} nonaktif`, icon:UserX, iconColor:'text-amber-600', iconBg:'bg-amber-50' },
    { title:'Total Gaji / Bulan', value:formatCurrency(summary?.total_salary??0), subtitle:'Karyawan aktif',                icon:Clock,     iconColor:'text-purple-600', iconBg:'bg-purple-50' },
  ]
  return <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{cards.map(c=><StatCard key={c.title} {...c} isLoading={isLoading&&!summary}/>)}</div>
}
