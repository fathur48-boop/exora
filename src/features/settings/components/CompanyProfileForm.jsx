import { useState, useEffect } from 'react'
import Input  from '../../../shared/components/ui/Input.jsx'
import Button from '../../../shared/components/ui/Button.jsx'
import { DEFAULT_SETTINGS } from '../utils/settingsHelpers.js'
export default function CompanyProfileForm({ settings,onSave,saving }) {
  const [fields,setFields] = useState({...DEFAULT_SETTINGS,...settings})
  useEffect(()=>{ if(settings) setFields(f=>({...f,...settings})) },[settings])
  const set=(k,v)=>setFields(f=>({...f,[k]:v}))
  const handleSubmit=async(e)=>{e.preventDefault();await onSave({company_name:fields.company_name,company_email:fields.company_email,company_phone:fields.company_phone,company_address:fields.company_address,company_website:fields.company_website})}
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama Perusahaan"  value={fields.company_name||''}    onChange={e=>set('company_name',e.target.value)}    placeholder="PT. Nama Perusahaan"/>
        <Input label="Email Perusahaan" type="email" value={fields.company_email||''} onChange={e=>set('company_email',e.target.value)} placeholder="info@perusahaan.com"/>
        <Input label="No. Telepon"      value={fields.company_phone||''}   onChange={e=>set('company_phone',e.target.value)}   placeholder="+62..."/>
        <Input label="Website"          value={fields.company_website||''} onChange={e=>set('company_website',e.target.value)} placeholder="https://perusahaan.com"/>
        <div className="sm:col-span-2 flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Alamat</label>
          <textarea value={fields.company_address||''} onChange={e=>set('company_address',e.target.value)} rows={3} placeholder="Alamat lengkap perusahaan…"
            className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none transition-all"/></div>
      </div>
      <div className="flex justify-end"><Button type="submit" size="sm" loading={saving}>Simpan Profil</Button></div>
    </form>
  )
}
