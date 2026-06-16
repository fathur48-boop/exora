import { useState } from 'react'
import Input  from '../../../../shared/components/ui/Input.jsx'
import Button from '../../../../shared/components/ui/Button.jsx'
import { TASK_STATUSES,PRIORITIES } from '../../utils/projectHelpers.js'
const EMPTY={title:'',description:'',status:'todo',priority:'medium',assigned_name:'',due_date:''}
export default function TaskForm({ initial,onSubmit,onCancel,saving }) {
  const [fields,setFields]=useState(initial?{...initial,due_date:initial.due_date?.slice(0,10)??''}:EMPTY)
  const [errors,setErrors]=useState({})
  const set=(k,v)=>{setFields(f=>({...f,[k]:v}));if(errors[k])setErrors(e=>({...e,[k]:null}))}
  const validate=()=>{const e={};if(!fields.title.trim())e.title='Judul task wajib diisi';return e}
  const handleSubmit=async(ev)=>{ev.preventDefault();const e=validate();if(Object.keys(e).length){setErrors(e);return};await onSubmit(fields)}
  const sel="h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <Input label="Judul Task *" value={fields.title} onChange={e=>set('title',e.target.value)} error={errors.title} placeholder="Judul task"/>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Status</label><select value={fields.status} onChange={e=>set('status',e.target.value)} className={sel}>{TASK_STATUSES.map(s=><option key={s} value={s}>{s.replace('_',' ')}</option>)}</select></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Priority</label><select value={fields.priority} onChange={e=>set('priority',e.target.value)} className={sel}>{PRIORITIES.map(p=><option key={p} value={p} className="capitalize">{p}</option>)}</select></div>
      </div>
      <Input label="Assigned To" value={fields.assigned_name} onChange={e=>set('assigned_name',e.target.value)} placeholder="Nama yang bertanggung jawab"/>
      <Input label="Due Date" type="date" value={fields.due_date} onChange={e=>set('due_date',e.target.value)}/>
      <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Deskripsi</label>
        <textarea value={fields.description} onChange={e=>set('description',e.target.value)} rows={2} placeholder="Detail task…"
          className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none transition-all"/></div>
      <div className="flex gap-2 justify-end pt-1"><Button type="button" variant="secondary" size="sm" onClick={onCancel}>Batal</Button><Button type="submit" size="sm" loading={saving}>{initial?'Simpan':'Tambah task'}</Button></div>
    </form>
  )
}
