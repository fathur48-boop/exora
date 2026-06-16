import { useState } from 'react'
import Button from '../../../../shared/components/ui/Button.jsx'
import Input  from '../../../../shared/components/ui/Input.jsx'
import { ATTENDANCE_STATUSES,ATTENDANCE_CONFIG } from '../../utils/hrHelpers.js'
import { cn } from '../../../../shared/utils/cn.js'
export default function AttendanceForm({ employeeId,date,existing,onSubmit,saving }) {
  const [status,setStatus]   = useState(existing?.status??'present')
  const [checkIn,setCheckIn] = useState(existing?.check_in??'')
  const [checkOut,setCheckOut]=useState(existing?.check_out??'')
  const [notes,setNotes]     = useState(existing?.notes??'')
  const handleSubmit=async(e)=>{e.preventDefault();await onSubmit({employee_id:employeeId,date,status,check_in:checkIn,check_out:checkOut,notes})}
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {ATTENDANCE_STATUSES.map(s=>{
          const cfg=ATTENDANCE_CONFIG[s]
          return <button key={s} type="button" onClick={()=>setStatus(s)} className={cn('px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all',status===s?`${cfg.color} border-current`:'border-surface-border bg-white text-ink-muted hover:bg-surface-subtle')}>{cfg.label}</button>
        })}
      </div>
      <div className="grid grid-cols-2 gap-3"><Input label="Check In" type="time" value={checkIn} onChange={e=>setCheckIn(e.target.value)}/><Input label="Check Out" type="time" value={checkOut} onChange={e=>setCheckOut(e.target.value)}/></div>
      <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Catatan</label>
        <input value={notes} onChange={e=>setNotes(e.target.value)} placeholder="Keterangan…" className="h-9 px-3 rounded-lg border border-surface-border bg-white text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 transition-all"/></div>
      <Button type="submit" size="sm" loading={saving} className="w-full">Simpan Kehadiran</Button>
    </form>
  )
}
