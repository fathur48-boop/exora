import { Package }  from 'lucide-react'
import ProductRow   from './ProductRow.jsx'
import Spinner      from '../../../../shared/components/ui/Spinner.jsx'
import EmptyState   from '../../../crm/components/shared/EmptyState.jsx'
export default function ProductTable({ inventory,isLoading,onEdit,onDelete,onAdjust }) {
  if(isLoading)return <div className="flex justify-center py-20"><Spinner size="lg" className="text-ink-faint"/></div>
  if(!inventory.length)return <EmptyState icon={Package} title="Belum ada produk" description="Tambahkan produk pertama Anda"/>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead><tr className="border-b border-surface-border bg-surface-muted/50">
          {['Produk','SKU','Kategori','Deskripsi','Stok','Status','Harga Jual','Harga Modal','Aksi'].map(h=><th key={h} className="px-4 py-3 text-2xs font-bold text-ink-muted uppercase tracking-wider whitespace-nowrap">{h}</th>)}
        </tr></thead>
        <tbody className="bg-white">{inventory.map(item=><ProductRow key={item.product_id} item={item} onEdit={onEdit} onDelete={onDelete} onAdjust={onAdjust}/>)}</tbody>
      </table>
    </div>
  )
}
