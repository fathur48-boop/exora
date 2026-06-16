import { useState } from 'react'
import Input  from '../../../../shared/components/ui/Input.jsx'
import Button from '../../../../shared/components/ui/Button.jsx'
import { TRANSACTION_TYPES,TRANSACTION_STATUSES,PAYMENT_METHODS,getCategoriesByType,PAYMENT_LABELS } from '../../utils/financeHelpers.js'
const today = ()=>new Date().toISOString().slice(0,10)
const EMPTY = { type:'income',amount:'',category:'',description:'',reference:'',payment_method:'cash',status:'paid',contact_name:'',date:today(),notes:'' }
export default function TransactionForm({ initial,onSubmit,onCancel,saving }) {
  const [fields,setFields] = useState(initial?{...initial,amount:initial.amount??'',date:initial.date?.slice(0,10)??today()}:EMPTY)
  const [errors,setErrors] = useState({})
  const set = (k,v)=>{setFields(f=>({...f,[k]:v}));if(errors[k])setErrors(e=>({...e,[k]:null}))}
  const categories = getCategoriesByType(fields.type)
  const validate = ()=>{const e={};if(!fields.description.trim())e.description='Deskripsi wajib diisi';if(!fields.amount||isNaN(Number(fields.amount))||Number(fields.amount)<=0)e.amount='Jumlah harus lebih dari 0';if(!fields.date)e.date='Tanggal wajib diisi';return e}
  const handleSubmit = async(ev)=>{ev.preventDefault();const e=validate();if(Object.keys(e).length){setErrors(e);return};await onSubmit({...fields,amount:Number(fields.amount)})}
  const sel = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-2">
        {TRANSACTION_TYPES.map(t=>(
          <button key={t} type="button" onClick={()=>{set('type',t);set('category','')}}
            className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${fields.type===t?(t==='income'?'border-green-500 bg-green-50 text-green-700':'border-red-500 bg-red-50 text-red-700'):'border-surface-border bg-white text-ink-muted hover:bg-surface-subtle'}`}>
            {t==='income'?'↑ Income':'↓ Expense'}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Jumlah (IDR) *" type="number" min="0" value={fields.amount} onChange={e=>set('amount',e.target.value)} error={errors.amount} placeholder="0"/>
        <Input label="Tanggal *" type="date" value={fields.date} onChange={e=>set('date',e.target.value)} error={errors.date}/>
        <div className="sm:col-span-2"><Input label="Deskripsi *" value={fields.description} onChange={e=>set('description',e.target.value)} error={errors.description} placeholder="Keterangan transaksi"/></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Kategori</label>
          <select value={fields.category} onChange={e=>set('category',e.target.value)} className={sel}><option value="">Pilih kategori</option>{categories.map(c=><option key={c} value={c}>{c}</option>)}</select></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Metode Pembayaran</label>
          <select value={fields.payment_method} onChange={e=>set('payment_method',e.target.value)} className={sel}>{PAYMENT_METHODS.map(m=><option key={m} value={m}>{PAYMENT_LABELS[m]}</option>)}</select></div>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Status</label>
          <select value={fields.status} onChange={e=>set('status',e.target.value)} className={sel}>{TRANSACTION_STATUSES.map(s=><option key={s} value={s} className="capitalize">{s}</option>)}</select></div>
        <Input label="Nama Kontak" value={fields.contact_name} onChange={e=>set('contact_name',e.target.value)} placeholder="Customer / Vendor"/>
        <Input label="No. Referensi" value={fields.reference} onChange={e=>set('reference',e.target.value)} placeholder="No. Invoice / PO"/>
        <div className="sm:col-span-2 flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Catatan</label>
          <textarea value={fields.notes} onChange={e=>set('notes',e.target.value)} rows={2} placeholder="Catatan tambahan…"
            className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none transition-all"/></div>
      </div>
      <div className="flex gap-2 justify-end pt-2"><Button type="button" variant="secondary" size="sm" onClick={onCancel}>Batal</Button><Button type="submit" size="sm" loading={saving}>{initial?'Simpan':'Tambah transaksi'}</Button></div>
    </form>
  )
}
