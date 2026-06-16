import { LEAD_STAGES, formatStageLabel } from '../../utils/crmHelpers.js'
export default function LeadStageSelect({ value, onChange, disabled }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)} disabled={disabled}
      className="h-8 px-2 text-xs rounded-lg border border-surface-border bg-white text-ink focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 disabled:opacity-50 transition-all">
      {LEAD_STAGES.map(s=><option key={s} value={s}>{formatStageLabel(s)}</option>)}
    </select>
  )
}
