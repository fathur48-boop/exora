import { useState, useEffect } from 'react'
import Button from '../../../shared/components/ui/Button.jsx'
import { DEFAULT_SETTINGS,CURRENCY_OPTIONS,TIMEZONE_OPTIONS,DATE_FORMAT_OPTIONS,MONTH_OPTIONS } from '../utils/settingsHelpers.js'
const sel="h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all w-full"
export default function AppSettingsForm({ settings,onSave,saving }) {
  const [fields,setFields] = useState({...DEFAULT_SETTINGS,...settings})
  useEffect(()=>{ if(settings) setFields(f=>({...f,...settings})) },[settings])
  const set=(k,v)=>setFields(f=>({...f,[k]:v}))
  const handleSubmit=async(e)=>{e.preventDefault();await onSave({currency:fields.currency,timezone:fields.timezone,date_format:fields.date_format,fiscal_year_start:fields.fiscal_year_start})}
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Mata Uang</label><select value={fields.currency||'IDR'} onChange={e=>set('currency',e.target.value)} className={sel}>{CURRENCY_OPTIONS.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Timezone</label><select value={fields.timezone||'Asia/Jakarta'} onChange={e=>set('timezone',e.target.value)} className={sel}>{TIMEZONE_OPTIONS.map(t=><option key={t} value={t}>{t}</option>)}</select></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Format Tanggal</label><select value={fields.date_format||'DD/MM/YYYY'} onChange={e=>set('date_format',e.target.value)} className={sel}>{DATE_FORMAT_OPTIONS.map(f=><option key={f} value={f}>{f}</option>)}</select></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Awal Tahun Fiskal</label><select value={fields.fiscal_year_start||'01'} onChange={e=>set('fiscal_year_start',e.target.value)} className={sel}>{MONTH_OPTIONS.map(m=><option key={m.value} value={m.value}>{m.label}</option>)}</select></div>
      </div>
      <div className="flex justify-end"><Button type="submit" size="sm" loading={saving}>Simpan Pengaturan</Button></div>
    </form>
  )
}
