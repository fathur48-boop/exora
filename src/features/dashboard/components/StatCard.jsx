import { cn } from '../../../shared/utils/cn.js'
import Spinner from '../../../shared/components/ui/Spinner.jsx'

export default function StatCard({ title, value, subtitle, icon: Icon, iconColor='text-brand-600', iconBg='bg-brand-50', isLoading=false, trend }) {
  return (
    <div className="stat-card bg-white border border-surface-border rounded-xl p-5 shadow-card">
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
          <Icon className={cn('w-5 h-5', iconColor)} />
        </div>
        {trend && (
          <span className={cn('text-2xs font-semibold px-2 py-1 rounded-full',
            trend.direction === 'up'   ? 'bg-green-50 text-green-600' :
            trend.direction === 'down' ? 'bg-red-50 text-red-600'     : 'bg-gray-50 text-gray-500'
          )}>
            {trend.direction === 'up' ? '↑' : trend.direction === 'down' ? '↓' : '—'} {trend.pct}%
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-ink-muted truncate uppercase tracking-wide">{title}</p>
        {isLoading ? (
          <div className="mt-2"><Spinner size="sm" className="text-ink-faint" /></div>
        ) : (
          <>
            <p className="text-2xl font-extrabold text-ink mt-1 truncate tracking-tight">{value}</p>
            {subtitle && <p className="text-2xs text-ink-faint mt-1">{subtitle}</p>}
          </>
        )}
      </div>
    </div>
  )
}
