import { cn } from '../../../../shared/utils/cn.js'
import { STATUS_COLORS } from '../../utils/crmHelpers.js'
export default function CustomerStatusBadge({ status }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-semibold capitalize', STATUS_COLORS[status]??'bg-gray-100 text-gray-600')}>
      {status}
    </span>
  )
}
