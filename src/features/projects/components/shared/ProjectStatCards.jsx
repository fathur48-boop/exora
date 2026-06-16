import { FolderOpen,Play,CheckCircle,PauseCircle } from 'lucide-react'
import StatCard from '../../../dashboard/components/StatCard.jsx'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
export default function ProjectStatCards({ summary,isLoading }) {
  const cards = [
    { title:'Total Projects', value:String(summary?.total??0),                       subtitle:'Semua project',                                    icon:FolderOpen,    iconColor:'text-brand-600',  iconBg:'bg-brand-50'  },
    { title:'Active',         value:String(summary?.by_status?.active??0),           subtitle:`${summary?.by_status?.planning??0} planning`,      icon:Play,          iconColor:'text-green-600',  iconBg:'bg-green-50'  },
    { title:'Completed',      value:String(summary?.by_status?.completed??0),        subtitle:`${summary?.by_status?.cancelled??0} cancelled`,    icon:CheckCircle,   iconColor:'text-purple-600', iconBg:'bg-purple-50' },
    { title:'On Hold',        value:String(summary?.by_status?.on_hold??0),          subtitle:`Budget: ${formatCurrency(summary?.total_budget??0)}`, icon:PauseCircle, iconColor:'text-amber-600',  iconBg:'bg-amber-50'  },
  ]
  return <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">{cards.map(c=><StatCard key={c.title} {...c} isLoading={isLoading&&!summary}/>)}</div>
}
