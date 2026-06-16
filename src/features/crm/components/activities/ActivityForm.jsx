import { useState } from 'react'
import Button from '../../../../shared/components/ui/Button.jsx'
import { ACTIVITY_TYPES } from '../../utils/crmHelpers.js'
export default function ActivityForm({ onSubmit, saving }) {
  const [type,setType] = useState('note')
  const [desc,setDesc] = useState('')
  const [error,setError] = useState(null)
  const handleSubmit = async(e)=>{e.preventDefault();if(!desc.trim()){setError('Deskripsi wajib diisi');return};await onSubmit({type,description:desc});setDesc('');setError(null)}
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
      <div className="flex gap-2 flex-wrap">
        {ACTIVITY_TYPES.map(t=>(
          <button key={t} type="button" onClick={()=>setType(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${type===t?'bg-brand-600 text-white shadow-sm':'bg-surface-subtle text-ink-muted hover:bg-surface-border'}`}>
            {t}
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-1">
        <textarea value={desc} onChange={e=>{setDesc(e.target.value);setError(null)}} rows={3}
          placeholder="Tambahkan catatan, log panggilan…"
          className="px-3 py-2 rounded-lg border border-surface-border bg-white text-ink text-sm placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 resize-none transition-all"/>
        {error&&<p className="text-2xs text-red-500 font-medium">{error}</p>}
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="sm" loading={saving}>Catat aktivitas</Button>
      </div>
    </form>
  )
}
