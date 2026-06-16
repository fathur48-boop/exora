import { cn } from '../../../../shared/utils/cn.js'
export default function EmptyState({ icon: Icon, title, description, action, className }) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 px-6 text-center', className)}>
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-surface-subtle flex items-center justify-center mb-4 shadow-inner">
          <Icon className="w-7 h-7 text-ink-faint"/>
        </div>
      )}
      <p className="text-sm font-semibold text-ink">{title}</p>
      {description && <p className="text-xs text-ink-faint mt-1.5 max-w-xs leading-relaxed">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
