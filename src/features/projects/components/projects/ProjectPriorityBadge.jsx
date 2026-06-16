import { cn } from '../../../../shared/utils/cn.js'
import { PRIORITY_CONFIG } from '../../utils/projectHelpers.js'
export default function ProjectPriorityBadge({ priority }) {
  const cfg = PRIORITY_CONFIG[priority]??{label:priority,color:'bg-gray-100 text-gray-600'}
  return <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-semibold capitalize',cfg.color)}>{cfg.label}</span>
}
