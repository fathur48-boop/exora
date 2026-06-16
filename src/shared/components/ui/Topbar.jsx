import { RefreshCw } from 'lucide-react'
import Button from './Button.jsx'
export default function Topbar({ title, subtitle, onRefresh, isRefreshing }) {
  return (
    <header className="h-14 bg-white border-b border-surface-border flex items-center justify-between px-6 shrink-0 sticky top-0 z-20">
      <div>
        <h1 className="text-sm font-bold text-ink tracking-tight">{title}</h1>
        {subtitle && <p className="text-2xs text-ink-faint mt-0.5">{subtitle}</p>}
      </div>
      {onRefresh && (
        <Button variant="ghost" size="sm" onClick={onRefresh} loading={isRefreshing}
          leftIcon={<RefreshCw className="w-3.5 h-3.5" />}>
          Refresh
        </Button>
      )}
    </header>
  )
}
