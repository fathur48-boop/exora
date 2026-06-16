import { useState } from 'react'
import Input  from '../../../../shared/components/ui/Input.jsx'
import Button from '../../../../shared/components/ui/Button.jsx'
import { PROJECT_STATUSES,PRIORITIES } from '../../utils/projectHelpers.js'
const today=()=>new Date().toISOString().slice(0,10)
const EMPTY={name:'',description:'',status:'planning',priority:'medium',client_name:'',budget:'',spent:'',start_date:today(),end_date:''}
export default function ProjectForm({ initial,onSubmit,onCancel,saving }) {
  const [fields,setFields]=useState(initial?{...initial,budget:initial.budget??'',spent:initial.spent??'',start_date:initial.start_date?.slice(0,10)??today(),end_date:initial.end_date?.slice(0,10)??''}:EMPTY)
  const [errors,setErrors]=useState({})
  const set=(k,v)=>{setFields(f=>({...f,[k]:v}));if(errors[k])setErrors(e=>({...e,[k]:null}))}
  const validate=()=>{const e={};if(!fields.name.trim())e.name='Nama project wajib diisi';if(fields.budget!==''&&isNaN(Number(fields.budget)))e.budget='Harus angka';return e}
  const handleSubmit=async(ev)=>{ev.preventDefault();const e=validate();if(Object.keys(e).length){setErrors(e);return};await onSubmit({...fields,budget:fields.budget!==''?Number(fields.budget):0,spent:fields.spent!==''?Number(fields.spent):0})}
  const sel="h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2"><Input label="Nama Project *" value={fields.name} onChange={e=>set('name',e.target.value)} error={errors.name} placeholder="Nama project"/></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Status</label><select value={fields.status} onChange={e=>set('status',e.target.value)} className={sel}>{PROJECT_STATUSES.map(s=><option key={s} value={s} className="capitalize">{s.replace('_',' ')}</option>)}</select></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Priority</label><select value={fields.priority} onChange={e=>set('priority',e.target.value)} className={sel}>{PRIORITIES.map(p=><option key={p} value={p} className="capitalize">{p}</option>)}</select></div>
        <Input label="Nama Client"   value={fields.client_name} onChange={e=>set('client_name',e.target.value)} placeholder="Nama customer / klien"/>
        <Input label="Budget (IDR)"  type="number" value={fields.budget} onChange={e=>set('budget',e.target.value)} error={errors.budget} placeholder="0"/>
        <Input label="Spent (IDR)"   type="number" value={fields.spent}  onChange={e=>set('spent',e.target.value)}  placeholder="0"/>
        <Input label="Tanggal Mulai" type="date" value={fields.start_date} onChange={e=>set('start_date',e.target.value)}/>
        <Input label="Deadline"      type="date" value={fields.end_date}   onChange={e=>set('end_date',e.target.value)}/>
        <div className="sm:col-span-2 flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Deskripsi</label>
          <textarea value={fields.description} onChange={e=>set('description',e.target.value)} rows={3} placeholder="Deskripsi project…"
            className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none transition-all"/></div>
      </div>
      <div className="flex gap-2 justify-end pt-2"><Button type="button" variant="secondary" size="sm" onClick={onCancel}>Batal</Button><Button type="submit" size="sm" loading={saving}>{initial?'Simpan':'Buat project'}</Button></div>
    </form>
  )
}
