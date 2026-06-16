import { Target } from 'lucide-react'
import LeadRow    from './LeadRow.jsx'
import EmptyState from '../shared/EmptyState.jsx'
import Spinner    from '../../../../shared/components/ui/Spinner.jsx'
export default function LeadTable({ leads, isLoading, onEdit, onDelete, onStageChange }) {
  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
  if (!leads.length) return <EmptyState icon={Target} title="Belum ada leads" description="Tambahkan lead pertama Anda"/>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead><tr className="border-b border-surface-border bg-surface-muted/50">
          {['Lead','Source','Stage','Value','Aksi'].map(h=>(
            <th key={h} className="px-4 py-3 text-2xs font-bold text-ink-muted uppercase tracking-wider">{h}</th>
          ))}
        </tr></thead>
        <tbody className="bg-white">
          {leads.map(l=><LeadRow key={l.id} lead={l} onEdit={onEdit} onDelete={onDelete} onStageChange={onStageChange}/>)}
        </tbody>
      </table>
    </div>
  )
}
