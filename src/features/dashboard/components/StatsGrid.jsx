import { Users, TrendingUp, Target, Package, FolderOpen, UserCheck } from 'lucide-react'
import StatCard from './StatCard.jsx'
import { formatCurrency, shortNumber } from '../utils/dashboardHelpers.js'

export default function StatsGrid({ stats, isLoading }) {
  const cards = [
    { title:'Total Customers', value:shortNumber(stats?.total_customers??0), subtitle:'Pelanggan terdaftar',   icon:Users,      iconColor:'text-blue-600',   iconBg:'bg-blue-50'   },
    { title:'Total Revenue',   value:formatCurrency(stats?.total_revenue??0), subtitle:`${formatCurrency(stats?.recent_revenue??0)} bulan ini`, icon:TrendingUp, iconColor:'text-green-600', iconBg:'bg-green-50' },
    { title:'Active Leads',    value:shortNumber(stats?.active_leads??0),     subtitle:`${stats?.total_leads??0} total leads`,  icon:Target,     iconColor:'text-amber-600',  iconBg:'bg-amber-50'  },
    { title:'Total Products',  value:shortNumber(stats?.total_products??0),   subtitle:'Dalam katalog',         icon:Package,    iconColor:'text-purple-600', iconBg:'bg-purple-50' },
    { title:'Active Projects', value:shortNumber(stats?.active_projects??0),  subtitle:`${stats?.total_projects??0} total`,     icon:FolderOpen, iconColor:'text-brand-600',  iconBg:'bg-brand-50'  },
    { title:'Employees',       value:shortNumber(stats?.total_employees??0),  subtitle:'Staff aktif',           icon:UserCheck,  iconColor:'text-rose-600',   iconBg:'bg-rose-50'   },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {cards.map(c => <StatCard key={c.title} {...c} isLoading={isLoading} />)}
    </div>
  )
}
