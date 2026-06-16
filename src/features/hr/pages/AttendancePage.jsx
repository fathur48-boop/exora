import { useState, useEffect } from 'react'
import Topbar            from '../../../shared/components/ui/Topbar.jsx'
import AttendanceTable   from '../components/attendance/AttendanceTable.jsx'
import { useAttendance } from '../hooks/useAttendance.js'
export default function AttendancePage() {
  const today = new Date().toISOString().slice(0,10)
  const [date,setDate] = useState(today)
  const { attendance,isLoading,loadByDate } = useAttendance()
  const records = attendance[`date_${date}`] ?? null
  useEffect(()=>{ loadByDate(date) },[date])
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Kehadiran" subtitle="Rekap per hari"/>
      <div className="flex-1 p-6 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <label className="text-sm font-semibold text-ink">Tanggal:</label>
          <input type="date" value={date} onChange={e=>setDate(e.target.value)} className="h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"/>
        </div>
        <div className="bg-white border border-surface-border rounded-xl shadow-card overflow-hidden"><AttendanceTable records={records??[]} isLoading={records===null||isLoading} showEmployee/></div>
      </div>
    </div>
  )
}
