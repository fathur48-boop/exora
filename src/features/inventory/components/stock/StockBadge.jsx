import { cn } from '../../../../shared/utils/cn.js'
import { getStockStatus,STOCK_STATUS_CONFIG } from '../../utils/inventoryHelpers.js'
export default function StockBadge({ quantity, minStock }) {
  const status = getStockStatus(quantity,minStock)
  const cfg    = STOCK_STATUS_CONFIG[status]
  return (
    <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-semibold',cfg.color)}>
      <span className={cn('w-1.5 h-1.5 rounded-full',cfg.dot)}/>{cfg.label}
    </span>
  )
}
