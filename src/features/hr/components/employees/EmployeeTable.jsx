import { Users } from 'lucide-react'
import EmployeeRow from './EmployeeRow.jsx'
import Spinner     from '../../../../shared/components/ui/Spinner.jsx'
import EmptyState  from '../../../crm/components/shared/EmptyState.jsx'
export default function EmployeeTable({ employees,isLoading,onEdit,onDelete }) {
  if(isLoading)return <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
  if(!employees.length)return <EmptyState icon={Users} title="Belum ada karyawan" description="Tambahkan karyawan pertama"/>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead><tr className="border-b border-surface-border bg-surface-muted/50">
          {['Karyawan','Jabatan','Departemen','Status','Gaji','Tgl Masuk','Aksi'].map(h=><th key={h} className="px-4 py-3 text-2xs font-bold text-ink-muted uppercase tracking-wider whitespace-nowrap">{h}</th>)}
        </tr></thead>
        <tbody className="bg-white">{employees.map(e=><EmployeeRow key={e.id} employee={e} onEdit={onEdit} onDelete={onDelete}/>)}</tbody>
      </table>
    </div>
  )
}
