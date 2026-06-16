import { Check,X,Trash2 } from 'lucide-react'
import Button  from '../../../../shared/components/ui/Button.jsx'
import Spinner from '../../../../shared/components/ui/Spinner.jsx'
import { cn }  from '../../../../shared/utils/cn.js'
import { LEAVE_TYPE_CONFIG,LEAVE_STATUS_CONFIG,calcLeaveDays,formatDate } from '../../utils/hrHelpers.js'
export default function LeaveTable({ leaves,isLoading,onApprove,onReject,onDelete,showEmployee=true }) {
  if(isLoading)return <div className="flex justify-center py-10"><Spinner size="lg" className="text-ink-faint"/></div>
  if(!leaves.length)return <p className="text-center text-xs text-ink-faint py-10">Belum ada pengajuan cuti</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead><tr className="border-b border-surface-border bg-surface-muted/50">
          {[showEmployee&&'Karyawan','Tipe','Mulai','Selesai','Hari','Alasan','Status','Aksi'].filter(Boolean).map(h=><th key={h} className="px-4 py-3 text-2xs font-bold text-ink-muted uppercase tracking-wider whitespace-nowrap">{h}</th>)}
        </tr></thead>
        <tbody className="bg-white">
          {leaves.map(l=>{
            const typeCfg=LEAVE_TYPE_CONFIG[l.type]??{label:l.type,color:'bg-gray-100 text-gray-600'}
            const statusCfg=LEAVE_STATUS_CONFIG[l.status]??{label:l.status,color:'bg-gray-100 text-gray-600'}
            const days=calcLeaveDays(l.start_date,l.end_date)
            return <tr key={l.id} className="border-b border-surface-border table-row-hover group">
              {showEmployee&&<td className="px-4 py-3"><p className="text-sm font-semibold text-ink">{l.employee_name}</p>{l.employee_department&&<p className="text-2xs text-ink-faint">{l.employee_department}</p>}</td>}
              <td className="px-4 py-3"><span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-semibold',typeCfg.color)}>{typeCfg.label}</span></td>
              <td className="px-4 py-3 text-sm text-ink-muted whitespace-nowrap">{formatDate(l.start_date)}</td>
              <td className="px-4 py-3 text-sm text-ink-muted whitespace-nowrap">{formatDate(l.end_date)}</td>
              <td className="px-4 py-3 text-sm font-bold text-ink">{days}</td>
              <td className="px-4 py-3 text-sm text-ink-muted max-w-[160px] truncate">{l.reason}</td>
              <td className="px-4 py-3"><span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-semibold',statusCfg.color)}>{statusCfg.label}</span></td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {l.status==='pending'&&onApprove&&<Button variant="ghost" size="icon" onClick={()=>onApprove(l.id)} title="Setujui"><Check className="w-3.5 h-3.5 text-green-600"/></Button>}
                  {l.status==='pending'&&onReject &&<Button variant="ghost" size="icon" onClick={()=>onReject(l.id)} title="Tolak"><X className="w-3.5 h-3.5 text-red-500"/></Button>}
                  {onDelete&&<Button variant="ghost" size="icon" onClick={()=>onDelete(l.id)}><Trash2 className="w-3.5 h-3.5 text-red-500"/></Button>}
                </div>
              </td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  )
}
