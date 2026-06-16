import { useNavigate } from 'react-router-dom'
import { Edit2,Trash2,ExternalLink,ArrowUpDown } from 'lucide-react'
import Button     from '../../../../shared/components/ui/Button.jsx'
import StockBadge from '../stock/StockBadge.jsx'
import { formatCurrency }   from '../../../dashboard/utils/dashboardHelpers.js'
import { formatUnit }       from '../../utils/inventoryHelpers.js'
export default function ProductRow({ item,onEdit,onDelete,onAdjust }) {
  const navigate = useNavigate()
  return (
    <tr className="border-b border-surface-border table-row-hover group">
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-ink">{item.product_name}</p>
      </td>
      <td className="px-4 py-3 text-sm font-mono text-ink-muted">{item.product_sku||'—'}</td>
      <td className="px-4 py-3 text-sm text-ink-muted">{item.product_category||'—'}</td>
      <td className="px-4 py-3 text-sm text-ink-muted max-w-[160px] truncate" title={item.product_description}>{item.product_description||'—'}</td>
      <td className="px-4 py-3">
        <p className="text-sm font-bold text-ink">{formatUnit(item.quantity,item.product_unit)}</p>
        {item.min_stock>0&&<p className="text-2xs text-ink-faint">Min: {formatUnit(item.min_stock,item.product_unit)}</p>}
      </td>
      <td className="px-4 py-3"><StockBadge quantity={item.quantity} minStock={item.min_stock}/></td>
      <td className="px-4 py-3 text-sm font-semibold text-ink">{formatCurrency(item.product_price)}</td>
      <td className="px-4 py-3 text-sm text-ink-muted">{formatCurrency(item.product_cost)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" onClick={()=>navigate(`/inventory/${item.product_id}`)}><ExternalLink className="w-3.5 h-3.5"/></Button>
          <Button variant="ghost" size="icon" onClick={()=>onAdjust(item)}><ArrowUpDown className="w-3.5 h-3.5 text-brand-600"/></Button>
          <Button variant="ghost" size="icon" onClick={()=>onEdit(item)}><Edit2 className="w-3.5 h-3.5"/></Button>
          <Button variant="ghost" size="icon" onClick={()=>onDelete(item)}><Trash2 className="w-3.5 h-3.5 text-red-500"/></Button>
        </div>
      </td>
    </tr>
  )
}
