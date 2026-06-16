import { useState } from 'react'
import Input  from '../../../../shared/components/ui/Input.jsx'
import Button from '../../../../shared/components/ui/Button.jsx'
import { EMPLOYEE_STATUSES } from '../../utils/hrHelpers.js'
const today=()=>new Date().toISOString().slice(0,10)
const EMPTY={full_name:'',email:'',phone:'',role:'',department:'',status:'active',salary:'',join_date:today(),birth_date:'',address:'',emergency_contact:'',notes:''}
export default function EmployeeForm({ initial,onSubmit,onCancel,saving }) {
  const [fields,setFields]=useState(initial?{...initial,salary:initial.salary??'',join_date:initial.join_date?.slice(0,10)??today(),birth_date:initial.birth_date?.slice(0,10)??''}:EMPTY)
  const [errors,setErrors]=useState({})
  const set=(k,v)=>{setFields(f=>({...f,[k]:v}));if(errors[k])setErrors(e=>({...e,[k]:null}))}
  const validate=()=>{const e={};if(!fields.full_name.trim())e.full_name='Nama wajib diisi';if(fields.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))e.email='Email tidak valid';if(fields.salary!==''&&isNaN(Number(fields.salary)))e.salary='Harus angka';return e}
  const handleSubmit=async(ev)=>{ev.preventDefault();const e=validate();if(Object.keys(e).length){setErrors(e);return};await onSubmit({...fields,salary:fields.salary!==''?Number(fields.salary):0})}
  const sel="h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama Lengkap *" value={fields.full_name} onChange={e=>set('full_name',e.target.value)} error={errors.full_name} placeholder="Nama lengkap"/>
        <Input label="Email" type="email" value={fields.email} onChange={e=>set('email',e.target.value)} error={errors.email} placeholder="email@perusahaan.com"/>
        <Input label="No. Telepon" value={fields.phone} onChange={e=>set('phone',e.target.value)} placeholder="+62..."/>
        <Input label="Jabatan" value={fields.role} onChange={e=>set('role',e.target.value)} placeholder="Contoh: Marketing Manager"/>
        <Input label="Departemen" value={fields.department} onChange={e=>set('department',e.target.value)} placeholder="Contoh: Marketing"/>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Status</label><select value={fields.status} onChange={e=>set('status',e.target.value)} className={sel}>{EMPLOYEE_STATUSES.map(s=><option key={s} value={s} className="capitalize">{s.replace('_',' ')}</option>)}</select></div>
        <Input label="Gaji (IDR)"    type="number" value={fields.salary}     onChange={e=>set('salary',e.target.value)}     error={errors.salary} placeholder="0"/>
        <Input label="Tanggal Masuk" type="date"   value={fields.join_date}  onChange={e=>set('join_date',e.target.value)}/>
        <Input label="Tanggal Lahir" type="date"   value={fields.birth_date} onChange={e=>set('birth_date',e.target.value)}/>
        <div className="sm:col-span-2"><Input label="Alamat" value={fields.address} onChange={e=>set('address',e.target.value)} placeholder="Alamat lengkap"/></div>
        <div className="sm:col-span-2"><Input label="Kontak Darurat" value={fields.emergency_contact} onChange={e=>set('emergency_contact',e.target.value)} placeholder="Nama & nomor kontak darurat"/></div>
        <div className="sm:col-span-2 flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Catatan</label>
          <textarea value={fields.notes} onChange={e=>set('notes',e.target.value)} rows={2} placeholder="Catatan tambahan…"
            className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none transition-all"/></div>
      </div>
      <div className="flex gap-2 justify-end pt-2"><Button type="button" variant="secondary" size="sm" onClick={onCancel}>Batal</Button><Button type="submit" size="sm" loading={saving}>{initial?'Simpan':'Tambah karyawan'}</Button></div>
    </form>
  )
}
