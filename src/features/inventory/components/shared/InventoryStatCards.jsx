import { Package, AlertTriangle, XCircle, DollarSign } from 'lucide-react'
import StatCard from '../../../dashboard/components/StatCard.jsx'
import { calcInventoryStats } from '../../utils/inventoryHelpers.js'
import { formatCurrency } from '../../../dashboard/utils/dashboardHelpers.js'
export default function InventoryStatCards({ inventory, isLoading }) {
  const s = calcInventoryStats(inventory)
  const cards = [
    { title:'Total Produk',   value:String(s.total),         subtitle:'Jenis produk',           icon:Package,       iconColor:'text-brand-600',  iconBg:'bg-brand-50'  },
    { title:'Stok Menipis',   value:String(s.lowStock),      subtitle:'Di bawah minimum',        icon:AlertTriangle, iconColor:'text-amber-600',  iconBg:'bg-amber-50'  },
    { title:'Stok Habis',     value:String(s.empty),         subtitle:'Perlu restock segera',    icon:XCircle,       iconColor:'text-red-600',    iconBg:'bg-red-50'    },
    { title:'Nilai Inventori', value:formatCurrency(s.totalValue), subtitle:'Total nilai stok', icon:DollarSign,    iconColor:'text-green-600',  iconBg:'bg-green-50'  },
  ]
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {cards.map(c=><StatCard key={c.title} {...c} isLoading={isLoading && !inventory.length}/>)}
    </div>
  )
}
