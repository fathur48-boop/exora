import { Receipt } from 'lucide-react'
import TransactionRow from './TransactionRow.jsx'
import Spinner        from '../../../../shared/components/ui/Spinner.jsx'
import EmptyState     from '../../../crm/components/shared/EmptyState.jsx'
export default function TransactionTable({ transactions,isLoading,onEdit,onDelete }) {
  if(isLoading)return <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
  if(!transactions.length)return <EmptyState icon={Receipt} title="Belum ada transaksi" description="Tambahkan transaksi pertama Anda"/>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead><tr className="border-b border-surface-border bg-surface-muted/50">
          {['Tanggal','Deskripsi','Kategori','Tipe','Jumlah','Status','Metode','Aksi'].map(h=><th key={h} className="px-4 py-3 text-2xs font-bold text-ink-muted uppercase tracking-wider whitespace-nowrap">{h}</th>)}
        </tr></thead>
        <tbody className="bg-white">{transactions.map(t=><TransactionRow key={t.id} transaction={t} onEdit={onEdit} onDelete={onDelete}/>)}</tbody>
      </table>
    </div>
  )
}
