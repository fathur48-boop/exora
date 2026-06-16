import { useState } from 'react'
import Input  from '../../../../shared/components/ui/Input.jsx'
import Button from '../../../../shared/components/ui/Button.jsx'
import { CUSTOMER_STATUSES } from '../../utils/crmHelpers.js'
const EMPTY = { name:'',email:'',phone:'',company:'',address:'',status:'active',notes:'' }
export default function CustomerForm({ initial, onSubmit, onCancel, saving }) {
  const [fields,setFields] = useState(initial??EMPTY)
  const [errors,setErrors] = useState({})
  const set = (k,v)=>{setFields(f=>({...f,[k]:v}));if(errors[k])setErrors(e=>({...e,[k]:null}))}
  const validate = ()=>{const e={};if(!fields.name.trim())e.name='Nama wajib diisi';if(fields.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email))e.email='Email tidak valid';return e}
  const handleSubmit = async(ev)=>{ev.preventDefault();const e=validate();if(Object.keys(e).length){setErrors(e);return};await onSubmit(fields)}
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama *"    value={fields.name}    onChange={e=>set('name',e.target.value)}    error={errors.name}  placeholder="Nama lengkap"/>
        <Input label="Perusahaan" value={fields.company} onChange={e=>set('company',e.target.value)} placeholder="Nama perusahaan"/>
        <Input label="Email"     type="email" value={fields.email} onChange={e=>set('email',e.target.value)} error={errors.email} placeholder="email@contoh.com"/>
        <Input label="Telepon"   value={fields.phone}   onChange={e=>set('phone',e.target.value)}   placeholder="+62..."/>
        <div className="sm:col-span-2"><Input label="Alamat" value={fields.address} onChange={e=>set('address',e.target.value)} placeholder="Alamat lengkap"/></div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-ink-secondary tracking-wide">Status</label>
          <select value={fields.status} onChange={e=>set('status',e.target.value)}
            className="h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all">
            {CUSTOMER_STATUSES.map(s=><option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>
        <div className="sm:col-span-2 flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-ink-secondary tracking-wide">Catatan</label>
          <textarea value={fields.notes} onChange={e=>set('notes',e.target.value)} rows={3}
            placeholder="Catatan tambahan…"
            className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none transition-all"/>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2">
        <Button type="button" variant="secondary" size="sm" onClick={onCancel}>Batal</Button>
        <Button type="submit" size="sm" loading={saving}>{initial?'Simpan':'Tambah customer'}</Button>
      </div>
    </form>
  )
}
