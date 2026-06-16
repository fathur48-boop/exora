import { useState } from 'react'
import Input  from '../../../../shared/components/ui/Input.jsx'
import Button from '../../../../shared/components/ui/Button.jsx'
import { PRODUCT_UNITS } from '../../utils/inventoryHelpers.js'
const EMPTY = { name:'',sku:'',category:'',description:'',price:'',cost:'',unit:'pcs',is_active:true }
export default function ProductForm({ initial,onSubmit,onCancel,saving }) {
  const [fields,setFields] = useState(initial ? {...initial,price:initial.price??'',cost:initial.cost??''} : EMPTY)
  const [errors,setErrors] = useState({})
  const set = (k,v)=>{setFields(f=>({...f,[k]:v}));if(errors[k])setErrors(e=>({...e,[k]:null}))}
  const validate = ()=>{const e={};if(!fields.name.trim())e.name='Nama produk wajib diisi';if(fields.price!==''&&isNaN(Number(fields.price)))e.price='Harus angka';if(fields.cost!==''&&isNaN(Number(fields.cost)))e.cost='Harus angka';return e}
  const handleSubmit = async(ev)=>{ev.preventDefault();const e=validate();if(Object.keys(e).length){setErrors(e);return};await onSubmit({...fields,price:fields.price!==''?Number(fields.price):0,cost:fields.cost!==''?Number(fields.cost):0})}
  const sel = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama Produk *" value={fields.name}     onChange={e=>set('name',e.target.value)}     error={errors.name} placeholder="Nama produk"/>
        <Input label="SKU"           value={fields.sku}      onChange={e=>set('sku',e.target.value)}      placeholder="Auto-generate jika kosong"/>
        <Input label="Kategori"      value={fields.category} onChange={e=>set('category',e.target.value)} placeholder="Contoh: Elektronik"/>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Satuan</label>
          <select value={fields.unit} onChange={e=>set('unit',e.target.value)} className={sel}>{PRODUCT_UNITS.map(u=><option key={u} value={u}>{u}</option>)}</select></div>
        <Input label="Harga Jual (IDR)" type="number" value={fields.price} onChange={e=>set('price',e.target.value)} error={errors.price} placeholder="0"/>
        <Input label="Harga Modal (IDR)" type="number" value={fields.cost} onChange={e=>set('cost',e.target.value)}  error={errors.cost}  placeholder="0"/>
        <div className="sm:col-span-2 flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Deskripsi</label>
          <textarea value={fields.description} onChange={e=>set('description',e.target.value)} rows={2} placeholder="Deskripsi produk…"
            className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none transition-all"/></div>
        <div className="flex items-center gap-2">
          <input type="checkbox" id="is_active" checked={!!fields.is_active} onChange={e=>set('is_active',e.target.checked)} className="w-4 h-4 rounded border-surface-border text-brand-600 focus:ring-brand-500"/>
          <label htmlFor="is_active" className="text-sm font-medium text-ink cursor-pointer">Produk aktif</label>
        </div>
      </div>
      <div className="flex gap-2 justify-end pt-2"><Button type="button" variant="secondary" size="sm" onClick={onCancel}>Batal</Button><Button type="submit" size="sm" loading={saving}>{initial?'Simpan':'Tambah produk'}</Button></div>
    </form>
  )
}
