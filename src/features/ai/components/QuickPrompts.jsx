import { Zap } from 'lucide-react'
import { QUICK_PROMPTS } from '../utils/aiHelpers.js'
export default function QuickPrompts({ onSelect, disabled }) {
  return (
    <div className="px-4 py-3 border-t border-surface-border bg-surface-muted/30">
      <div className="flex items-center gap-1.5 mb-2">
        <Zap className="w-3 h-3 text-brand-500"/>
        <p className="text-2xs font-bold text-ink-faint uppercase tracking-wider">Quick Prompts</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {QUICK_PROMPTS.map(qp=>(
          <button key={qp.label} onClick={()=>onSelect(qp.prompt)} disabled={disabled}
            className="px-3 py-1.5 rounded-full border border-surface-border bg-white text-xs text-ink-secondary
              hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 disabled:opacity-40
              disabled:cursor-not-allowed transition-all duration-150 font-medium shadow-sm">
            {qp.label}
          </button>
        ))}
      </div>
    </div>
  )
}
