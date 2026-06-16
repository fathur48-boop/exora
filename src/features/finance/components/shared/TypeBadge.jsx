import { cn } from '../../../../shared/utils/cn.js'
import { TYPE_CONFIG, STATUS_CONFIG } from '../../utils/financeHelpers.js'
export function TypeBadge({ type }) {
  const cfg = TYPE_CONFIG[type]??{label:type,color:'bg-gray-100 text-gray-600',dot:'bg-gray-400'}
  return <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-semibold',cfg.color)}><span className={cn('w-1.5 h-1.5 rounded-full',cfg.dot)}/>{cfg.label}</span>
}
export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status]??{label:status,color:'bg-gray-100 text-gray-600'}
  return <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-semibold capitalize',cfg.color)}>{cfg.label}</span>
}
