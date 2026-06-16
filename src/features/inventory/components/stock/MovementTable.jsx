import { ArrowUpCircle,ArrowDownCircle,SlidersHorizontal } from 'lucide-react'
import Spinner from '../../../../shared/components/ui/Spinner.jsx'
import { cn }  from '../../../../shared/utils/cn.js'
import { MOVEMENT_COLORS,MOVEMENT_LABELS } from '../../utils/inventoryHelpers.js'
const ICONS = { in:ArrowUpCircle, out:ArrowDownCircle, adjustment:SlidersHorizontal }
function fmtDate(iso) { return new Date(iso).toLocaleString('id-ID',{day:'2-digit',month:'short',year:'numeric',hour:'2-digit',minute:'2-digit'}) }
export default function MovementTable({ movements,isLoading }) {
  if(isLoading)return <div className="flex justify-center py-10"><Spinner size="lg" className="text-ink-faint"/></div>
  if(!movements.length)return <p className="text-center text-xs text-ink-faint py-10">Belum ada riwayat pergerakan stok</p>
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead><tr className="border-b border-surface-border bg-surface-muted/50">
          {['Tipe','Produk','Jumlah','Referensi','Catatan','Waktu'].map(h=><th key={h} className="px-4 py-3 text-2xs font-bold text-ink-muted uppercase tracking-wider">{h}</th>)}
        </tr></thead>
        <tbody className="bg-white">
          {movements.map(m=>{
            const Icon=ICONS[m.type]??SlidersHorizontal
            return (
              <tr key={m.id} className="border-b border-surface-border table-row-hover">
                <td className="px-4 py-3">
                  <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-semibold',MOVEMENT_COLORS[m.type])}>
                    <Icon className="w-3 h-3"/>{MOVEMENT_LABELS[m.type]}
                  </span>
                </td>
                <td className="px-4 py-3"><p className="text-sm font-semibold text-ink">{m.product_name||'—'}</p>{m.product_sku&&<p className="text-2xs text-ink-faint">{m.product_sku}</p>}</td>
                <td className="px-4 py-3 text-sm font-bold text-ink">{Number(m.quantity).toLocaleString('id-ID')}</td>
                <td className="px-4 py-3 text-sm text-ink-muted">{m.reference||'—'}</td>
                <td className="px-4 py-3 text-sm text-ink-muted max-w-[180px] truncate">{m.notes||'—'}</td>
                <td className="px-4 py-3 text-xs text-ink-faint whitespace-nowrap">{fmtDate(m.created_at)}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
