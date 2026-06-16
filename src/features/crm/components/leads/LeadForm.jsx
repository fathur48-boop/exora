import { useState } from 'react'
import Input  from '../../../../shared/components/ui/Input.jsx'
import Button from '../../../../shared/components/ui/Button.jsx'
import { LEAD_STAGES, LEAD_SOURCES, formatStageLabel, formatSourceLabel } from '../../utils/crmHelpers.js'
const EMPTY = { name:'',email:'',phone:'',company:'',source:'other',stage:'new',value:'',notes:'' }
export default function LeadForm({ initial, onSubmit, onCancel, saving }) {
  const [fields,setFields] = useState(initial??EMPTY)
  const [errors,setErrors] = useState({})
  const set = (k,v)=>{setFields(f=>({...f,[k]:v}));if(errors[k])setErrors(e=>({...e,[k]:null}))}
  const validate = ()=>{const e={};if(!fields.name.trim())e.name='Nama wajib diisi';if(fields.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))e.email='Email tidak valid';if(fields.value&&isNaN(Number(fields.value)))e.value='Harus angka';return e}
  const handleSubmit = async(ev)=>{ev.preventDefault();const e=validate();if(Object.keys(e).length){setErrors(e);return};await onSubmit({...fields,value:fields.value?Number(fields.value):0})}
  const sel = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama *"    value={fields.name}    onChange={e=>set('name',e.target.value)}    error={errors.name}  placeholder="Nama lead"/>
        <Input label="Perusahaan" value={fields.company} onChange={e=>set('company',e.target.value)} placeholder="Perusahaan"/>
        <Input label="Email"     type="email" value={fields.email} onChange={e=>set('email',e.target.value)} error={errors.email} placeholder="email@contoh.com"/>
        <Input label="Telepon"   value={fields.phone}   onChange={e=>set('phone',e.target.value)}   placeholder="+62..."/>
        <Input label="Est. Value (IDR)" type="number" value={fields.value} onChange={e=>set('value',e.target.value)} error={errors.value} placeholder="0"/>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Source</label>
          <select value={fields.source} onChange={e=>set('source',e.target.value)} className={sel}>{LEAD_SOURCES.map(s=><option key={s} value={s}>{formatSourceLabel(s)}</option>)}</select></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Stage</label>
          <select value={fields.stage} onChange={e=>set('stage',e.target.value)} className={sel}>{LEAD_STAGES.map(s=><option key={s} value={s}>{formatStageLabel(s)}</option>)}</select></div>
        <div className="sm:col-span-2 flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Catatan</label>
          <textarea value={fields.notes} onChange={e=>set('notes',e.target.value)} rows={3} placeholder="Catatan…"
            className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none transition-all"/></div>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>Batal</Button>
        <Button type="submit" size="sm" loading={saving}>{initial?'Simpan':'Buat lead'}</Button>
      </div>
    </form>
  )
}
