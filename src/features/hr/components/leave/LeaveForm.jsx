import { useState } from 'react'
import Input  from '../../../../shared/components/ui/Input.jsx'
import Button from '../../../../shared/components/ui/Button.jsx'
import { LEAVE_TYPES,LEAVE_TYPE_CONFIG,calcLeaveDays } from '../../utils/hrHelpers.js'
export default function LeaveForm({ employeeId,employeeName,onSubmit,onCancel,saving }) {
  const [fields,setFields]=useState({type:'annual',start_date:'',end_date:'',reason:''})
  const [errors,setErrors]=useState({})
  const set=(k,v)=>{setFields(f=>({...f,[k]:v}));if(errors[k])setErrors(e=>({...e,[k]:null}))}
  const days = fields.start_date&&fields.end_date?calcLeaveDays(fields.start_date,fields.end_date):0
  const validate=()=>{const e={};if(!fields.start_date)e.start_date='Tanggal mulai wajib diisi';if(!fields.end_date)e.end_date='Tanggal selesai wajib diisi';if(!fields.reason.trim())e.reason='Alasan wajib diisi';if(fields.start_date&&fields.end_date&&new Date(fields.end_date)<new Date(fields.start_date))e.end_date='Tanggal selesai tidak boleh sebelum mulai';return e}
  const handleSubmit=async(ev)=>{ev.preventDefault();const e=validate();if(Object.keys(e).length){setErrors(e);return};await onSubmit({...fields,employee_id:employeeId})}
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {employeeName&&<p className="text-xs text-ink-muted">Pengajuan cuti untuk: <strong className="text-ink">{employeeName}</strong></p>}
      <div className="flex flex-wrap gap-2">
        {LEAVE_TYPES.map(t=>{
          const cfg=LEAVE_TYPE_CONFIG[t]
          return <button key={t} type="button" onClick={()=>set('type',t)} className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all ${fields.type===t?`${cfg.color} border-current`:'border-surface-border bg-white text-ink-muted hover:bg-surface-subtle'}`}>{cfg.label}</button>
        })}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Input label="Tanggal Mulai *"   type="date" value={fields.start_date} onChange={e=>set('start_date',e.target.value)} error={errors.start_date}/>
        <Input label="Tanggal Selesai *" type="date" value={fields.end_date}   onChange={e=>set('end_date',e.target.value)}   error={errors.end_date}/>
      </div>
      {days>0&&<p className="text-xs text-brand-600 font-bold">{days} hari kerja</p>}
      <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Alasan *</label>
        <textarea value={fields.reason} onChange={e=>set('reason',e.target.value)} rows={3} placeholder="Alasan pengajuan cuti…"
          className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none transition-all"/>
        {errors.reason&&<p className="text-2xs text-red-500 font-medium">{errors.reason}</p>}
      </div>
      <div className="flex gap-2 justify-end"><Button type="button" variant="secondary" size="sm" onClick={onCancel}>Batal</Button><Button type="submit" size="sm" loading={saving}>Ajukan Cuti</Button></div>
    </form>
  )
}
