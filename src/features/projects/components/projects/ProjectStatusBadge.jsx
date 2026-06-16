import { cn } from '../../../../shared/utils/cn.js'
import { PROJECT_STATUS_CONFIG } from '../../utils/projectHelpers.js'
export default function ProjectStatusBadge({ status }) {
  const cfg = PROJECT_STATUS_CONFIG[status]??{label:status,color:'bg-gray-100 text-gray-600',dot:'bg-gray-400'}
  return <span className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-2xs font-semibold',cfg.color)}><span className={cn('w-1.5 h-1.5 rounded-full',cfg.dot)}/>{cfg.label}</span>
}
