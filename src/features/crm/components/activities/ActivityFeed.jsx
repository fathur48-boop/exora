import { FileText, Phone, Mail, Calendar, Trash2 } from 'lucide-react'
import Spinner from '../../../../shared/components/ui/Spinner.jsx'
const ICONS = { note:FileText, call:Phone, email:Mail, meeting:Calendar }
const COLORS = { note:'bg-slate-100 text-slate-600', call:'bg-green-100 text-green-600', email:'bg-blue-100 text-blue-600', meeting:'bg-purple-100 text-purple-600' }
function timeAgo(dateStr) {
  const diff=Date.now()-new Date(dateStr).getTime()
  const mins=Math.floor(diff/60000),hours=Math.floor(diff/3600000),days=Math.floor(diff/86400000)
  if(mins<1)return 'baru saja';if(mins<60)return `${mins}m lalu`;if(hours<24)return `${hours}j lalu`;return `${days}h lalu`
}
export default function ActivityFeed({ activities, isLoading, onDelete }) {
  if(isLoading)return <div className="flex justify-center py-8"><Spinner size="md" className="text-ink-faint"/></div>
  if(!activities.length)return <p className="text-center text-xs text-ink-faint py-8">Belum ada aktivitas</p>
  return (
    <div className="flex flex-col gap-3">
      {activities.map(a=>{
        const Icon=ICONS[a.type]??FileText
        const color=COLORS[a.type]??'bg-slate-100 text-slate-600'
        return (
          <div key={a.id} className="flex gap-3 group">
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${color}`}>
              <Icon className="w-3.5 h-3.5"/>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm text-ink leading-snug">{a.description}</p>
                <button onClick={()=>onDelete(a.id)} className="shrink-0 text-ink-faint hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all mt-0.5">
                  <Trash2 className="w-3.5 h-3.5"/>
                </button>
              </div>
              <p className="text-2xs text-ink-faint mt-0.5 capitalize">{a.type} · {timeAgo(a.created_at)}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
