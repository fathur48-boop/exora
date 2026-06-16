import { Search, X } from 'lucide-react'
import { cn } from '../../../../shared/utils/cn.js'
export default function CrmSearchBar({ value, onChange, placeholder='Search…', className }) {
  return (
    <div className={cn('relative flex items-center', className)}>
      <Search className="absolute left-3 w-4 h-4 text-ink-faint pointer-events-none"/>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full h-9 pl-9 pr-8 text-sm rounded-lg border border-surface-border bg-white
          text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30
          focus:border-brand-400 hover:border-brand-300 transition-all"/>
      {value && (
        <button onClick={() => onChange('')} className="absolute right-3 text-ink-faint hover:text-ink transition-colors">
          <X className="w-3.5 h-3.5"/>
        </button>
      )}
    </div>
  )
}
