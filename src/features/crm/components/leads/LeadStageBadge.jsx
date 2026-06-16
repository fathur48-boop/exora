import { cn } from '../../../../shared/utils/cn.js'
import { STAGE_COLORS, formatStageLabel } from '../../utils/crmHelpers.js'
export default function LeadStageBadge({ stage }) {
  return (
    <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-2xs font-semibold', STAGE_COLORS[stage]??'bg-gray-100 text-gray-600')}>
      {formatStageLabel(stage)}
    </span>
  )
}
