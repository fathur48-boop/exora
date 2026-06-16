export const EMPLOYEE_STATUSES   = ['active','inactive','on_leave']
export const ATTENDANCE_STATUSES = ['present','absent','late','leave','holiday']
export const LEAVE_TYPES         = ['annual','sick','personal','unpaid']
export const LEAVE_STATUSES      = ['pending','approved','rejected']
export const EMPLOYEE_STATUS_CONFIG = {
  active:   {label:'Active',   color:'bg-green-100 text-green-700', dot:'bg-green-500'  },
  inactive: {label:'Inactive', color:'bg-gray-100 text-gray-600',   dot:'bg-gray-400'   },
  on_leave: {label:'On Leave', color:'bg-amber-100 text-amber-700', dot:'bg-amber-500'  },
}
export const ATTENDANCE_CONFIG = {
  present: {label:'Hadir',     color:'bg-green-100 text-green-700'  },
  absent:  {label:'Absen',     color:'bg-red-100 text-red-700'      },
  late:    {label:'Terlambat', color:'bg-orange-100 text-orange-700'},
  leave:   {label:'Cuti',      color:'bg-blue-100 text-blue-700'    },
  holiday: {label:'Libur',     color:'bg-purple-100 text-purple-700'},
}
export const LEAVE_TYPE_CONFIG = {
  annual:   {label:'Cuti Tahunan', color:'bg-blue-100 text-blue-700'    },
  sick:     {label:'Sakit',        color:'bg-red-100 text-red-700'      },
  personal: {label:'Keperluan',    color:'bg-purple-100 text-purple-700'},
  unpaid:   {label:'Tanpa Gaji',   color:'bg-gray-100 text-gray-600'    },
}
export const LEAVE_STATUS_CONFIG = {
  pending:  {label:'Pending',   color:'bg-amber-100 text-amber-700' },
  approved: {label:'Disetujui', color:'bg-green-100 text-green-700' },
  rejected: {label:'Ditolak',   color:'bg-red-100 text-red-700'     },
}
export function calcLeaveDays(start,end) {
  const s=new Date(start),e=new Date(end)
  return Math.max(1,Math.round((e-s)/(1000*60*60*24))+1)
}
export function filterEmployees(employees,search,status,department) {
  return employees.filter(e=>{
    const m=!search||e.full_name?.toLowerCase().includes(search.toLowerCase())||e.email?.toLowerCase().includes(search.toLowerCase())||e.role?.toLowerCase().includes(search.toLowerCase())||e.department?.toLowerCase().includes(search.toLowerCase())
    return m&&(!status||e.status===status)&&(!department||e.department===department)
  })
}
export function formatDate(iso) {
  if(!iso)return '—'
  return new Date(iso).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})
}
export function getDepartments(employees) { return [...new Set(employees.map(e=>e.department).filter(Boolean))] }
export function getMonthName(month) { return new Date(2000,month-1,1).toLocaleString('id-ID',{month:'long'}) }
