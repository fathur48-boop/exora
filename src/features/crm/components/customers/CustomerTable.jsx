import { Users } from 'lucide-react'
import CustomerRow from './CustomerRow.jsx'
import EmptyState  from '../shared/EmptyState.jsx'
import Spinner     from '../../../../shared/components/ui/Spinner.jsx'
export default function CustomerTable({ customers, isLoading, onEdit, onDelete }) {
  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
  if (!customers.length) return <EmptyState icon={Users} title="Belum ada customer" description="Tambahkan customer pertama Anda"/>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead><tr className="border-b border-surface-border bg-surface-muted/50">
          {['Customer','Email','Telepon','Status','Aksi'].map(h=>(
            <th key={h} className="px-4 py-3 text-2xs font-bold text-ink-muted uppercase tracking-wider">{h}</th>
          ))}
        </tr></thead>
        <tbody className="bg-white">
          {customers.map(c=><CustomerRow key={c.id} customer={c} onEdit={onEdit} onDelete={onDelete}/>)}
        </tbody>
      </table>
    </div>
  )
}
