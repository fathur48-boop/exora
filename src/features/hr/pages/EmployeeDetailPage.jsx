import { useState, useEffect }    from 'react'
import { useParams,useNavigate }  from 'react-router-dom'
import { ArrowLeft,Edit2,Plus }   from 'lucide-react'
import Topbar              from '../../../shared/components/ui/Topbar.jsx'
import Button              from '../../../shared/components/ui/Button.jsx'
import Spinner             from '../../../shared/components/ui/Spinner.jsx'
import Card, { CardBody,CardHeader } from '../../../shared/components/ui/Card.jsx'
import EmployeeStatusBadge from '../components/shared/EmployeeStatusBadge.jsx'
import EmployeeForm        from '../components/employees/EmployeeForm.jsx'
import AttendanceForm      from '../components/attendance/AttendanceForm.jsx'
import AttendanceTable     from '../components/attendance/AttendanceTable.jsx'
import LeaveForm            from '../components/leave/LeaveForm.jsx'
import LeaveTable           from '../components/leave/LeaveTable.jsx'
import { useEmployeeDetail } from '../hooks/useEmployeeDetail.js'
import { useEmployees }      from '../hooks/useEmployees.js'
import { useAttendance }     from '../hooks/useAttendance.js'
import { useLeaveRequests }  from '../hooks/useLeaveRequests.js'
import { fetchLeaveByEmployee } from '../services/hrService.js'
import { formatCurrency }    from '../../dashboard/utils/dashboardHelpers.js'
import { formatDate }        from '../utils/hrHelpers.js'

const TABS = ['Info','Kehadiran','Cuti']

export default function EmployeeDetailPage() {
  const { id } = useParams(); const navigate = useNavigate()
  const { employee,isLoading,reload } = useEmployeeDetail(id)
  const { update,saving:empSaving }   = useEmployees()
  const { attendance,saving:attSaving,loadByEmployee,record } = useAttendance()
  const { create:createLeave,saving:leaveSaving } = useLeaveRequests()

  const [activeTab,setTab]   = useState('Info')
  const [editing,setEditing] = useState(false)
  const [showAttForm,setAttForm] = useState(false)
  const [showLeaveForm,setLeaveForm] = useState(false)
  const [empLeaves,setEmpLeaves] = useState([])
  const [attDate,setAttDate] = useState(new Date().toISOString().slice(0,10))

  const attKey = `emp_${id}`
  const attRecords = attendance[attKey] ?? null

  useEffect(()=>{
    if(activeTab==='Kehadiran' && attRecords===null) loadByEmployee(id)
    if(activeTab==='Cuti') fetchLeaveByEmployee(id).then(setEmpLeaves).catch(()=>{})
  },[activeTab,id])

  if(isLoading)return <div className="flex items-center justify-center min-h-full"><Spinner size="lg" className="text-brand-400"/></div>
  if(!employee)return null

  const handleUpdate = async(data)=>{await update(id,data);await reload();setEditing(false)}
  const handleRecordAtt = async(data)=>{await record(data);await loadByEmployee(id);setAttForm(false)}
  const handleCreateLeave = async(data)=>{await createLeave(data);setEmpLeaves(await fetchLeaveByEmployee(id));setLeaveForm(false)}

  return (
    <div className="flex flex-col min-h-full">
      <Topbar title={employee.full_name} subtitle="Detail karyawan"/>
      <div className="flex-1 p-6 flex flex-col gap-6 max-w-5xl">
        <button onClick={()=>navigate('/hr')} className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand-600 transition-colors w-fit font-medium"><ArrowLeft className="w-3.5 h-3.5"/> Kembali ke HR</button>
        <div className="flex gap-1 border-b border-surface-border">
          {TABS.map(tab=><button key={tab} onClick={()=>setTab(tab)} className={`px-4 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px ${activeTab===tab?'border-brand-600 text-brand-600':'border-transparent text-ink-muted hover:text-ink'}`}>{tab}</button>)}
        </div>

        {activeTab==='Info' && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 font-bold text-sm">{employee.full_name?.charAt(0)?.toUpperCase()}</div>
                <div><p className="text-sm font-bold text-ink">{employee.full_name}</p><p className="text-xs text-ink-muted">{employee.role} {employee.department&&`· ${employee.department}`}</p></div>
              </div>
              <Button variant="ghost" size="sm" leftIcon={<Edit2 className="w-3.5 h-3.5"/>} onClick={()=>setEditing(true)}>Edit</Button>
            </CardHeader>
            <CardBody>
              {editing ? <EmployeeForm initial={employee} onSubmit={handleUpdate} onCancel={()=>setEditing(false)} saving={empSaving}/>
              : <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[['Status',<EmployeeStatusBadge key="s" status={employee.status}/>],['Email',employee.email||'—'],['Telepon',employee.phone||'—'],['Gaji',formatCurrency(employee.salary)],['Tgl Masuk',formatDate(employee.join_date)],['Tgl Lahir',formatDate(employee.birth_date)],['Alamat',employee.address||'—'],['Ktr Darurat',employee.emergency_contact||'—']].map(([label,value])=>(
                    <div key={label}><p className="text-2xs text-ink-faint mb-0.5 font-medium uppercase tracking-wide">{label}</p><div className="text-sm text-ink font-medium">{value}</div></div>
                  ))}
                  {employee.notes&&<div className="col-span-2 sm:col-span-3"><p className="text-2xs text-ink-faint mb-0.5 font-medium uppercase tracking-wide">Catatan</p><p className="text-sm text-ink">{employee.notes}</p></div>}
                </div>}
            </CardBody>
          </Card>
        )}

        {activeTab==='Kehadiran' && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <input type="date" value={attDate} onChange={e=>setAttDate(e.target.value)} className="h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"/>
              <Button size="sm" leftIcon={<Plus className="w-4 h-4"/>} onClick={()=>setAttForm(true)}>Catat Kehadiran</Button>
            </div>
            {showAttForm && <Card><CardBody><AttendanceForm employeeId={id} date={attDate} onSubmit={handleRecordAtt} saving={attSaving}/></CardBody></Card>}
            <Card><CardBody className="p-0"><AttendanceTable records={attRecords??[]} isLoading={attRecords===null}/></CardBody></Card>
          </div>
        )}

        {activeTab==='Cuti' && (
          <div className="flex flex-col gap-4">
            <div className="flex justify-end"><Button size="sm" leftIcon={<Plus className="w-4 h-4"/>} onClick={()=>setLeaveForm(true)}>Ajukan Cuti</Button></div>
            {showLeaveForm && <Card><CardBody><LeaveForm employeeId={id} employeeName={employee.full_name} onSubmit={handleCreateLeave} onCancel={()=>setLeaveForm(false)} saving={leaveSaving}/></CardBody></Card>}
            <Card><CardBody className="p-0"><LeaveTable leaves={empLeaves} isLoading={false} showEmployee={false}/></CardBody></Card>
          </div>
        )}
      </div>
    </div>
  )
}
