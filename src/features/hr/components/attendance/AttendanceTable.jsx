import { cn } from '../../../../shared/utils/cn.js'
import Spinner from '../../../../shared/components/ui/Spinner.jsx'
import { ATTENDANCE_CONFIG } from '../../utils/hrHelpers.js'
export default function AttendanceTable({ records,isLoading,showEmployee=false }) {
  if(isLoading)return <div className="flex justify-center py-10"><Spinner size="lg" className="text-ink-faint"/></div>
  if(!records.length)return <p className="text-center text-xs text-ink-faint py-10">Belum ada data kehadiran</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead><tr className="border-b border-surface-border bg-surface-muted/50">
          {[showEmployee&&'Karyawan','Tanggal','Status','Check In','Check Out','Catatan'].filter(Boolean).map(h=><th key={h} className="px-4 py-3 text-2xs font-bold text-ink-muted uppercase tracking-wider">{h}</th>)}
        </tr></thead>
        <tbody className="bg-white">
          {records.map(r=>{
            const cfg=ATTENDANCE_CONFIG[r.status]??{label:r.status,color:'bg-gray-100 text-gray-600'}
            return <tr key={r.id} className="border-b border-surface-border table-row-hover">
              {showEmployee&&<td className="px-4 py-3"><p className="text-sm font-semibold text-ink">{r.employee_name}</p>{r.employee_department&&<p className="text-2xs text-ink-faint">{r.employee_department}</p>}</td>}
              <td className="px-4 py-3 text-sm text-ink-muted whitespace-nowrap">{r.date}</td>
              <td className="px-4 py-3"><span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-semibold',cfg.color)}>{cfg.label}</span></td>
              <td className="px-4 py-3 text-sm text-ink-muted">{r.check_in||'—'}</td>
              <td className="px-4 py-3 text-sm text-ink-muted">{r.check_out||'—'}</td>
              <td className="px-4 py-3 text-sm text-ink-muted max-w-[160px] truncate">{r.notes||'—'}</td>
            </tr>
          })}
        </tbody>
      </table>
    </div>
  )
}
