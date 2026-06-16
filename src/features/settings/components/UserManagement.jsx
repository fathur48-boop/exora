import { useState } from 'react'
import { Plus,Edit2,Trash2,Shield } from 'lucide-react'
import Button             from '../../../shared/components/ui/Button.jsx'
import Input              from '../../../shared/components/ui/Input.jsx'
import Spinner            from '../../../shared/components/ui/Spinner.jsx'
import DeleteConfirmModal from '../../crm/components/shared/DeleteConfirmModal.jsx'
import { useUsers }       from '../hooks/useUsers.js'
import { useAuthStore }   from '../../auth/store/authStore.js'
import { ROLE_OPTIONS,ROLE_CONFIG } from '../utils/settingsHelpers.js'
import { cn } from '../../../shared/utils/cn.js'

const EMPTY_FORM = { full_name:'',email:'',password:'',role:'staff' }
const sel = "h-9 px-3 rounded-lg border border-surface-border bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300 transition-all"

function UserForm({ initial,onSubmit,onCancel,saving }) {
  const [fields,setFields] = useState(initial??EMPTY_FORM)
  const [errors,setErrors] = useState({})
  const set=(k,v)=>{setFields(f=>({...f,[k]:v}));if(errors[k])setErrors(e=>({...e,[k]:null}))}
  const validate=()=>{const e={};if(!fields.full_name.trim())e.full_name='Nama wajib diisi';if(!initial&&!fields.email?.trim())e.email='Email wajib diisi';if(!initial&&!fields.password)e.password='Password wajib diisi';if(!initial&&fields.password&&fields.password.length<6)e.password='Minimal 6 karakter';return e}
  const handleSubmit=async(ev)=>{ev.preventDefault();const e=validate();if(Object.keys(e).length){setErrors(e);return};await onSubmit(fields)}
  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Nama Lengkap *" value={fields.full_name} onChange={e=>set('full_name',e.target.value)} error={errors.full_name} placeholder="Nama lengkap"/>
        {!initial && <Input label="Email *" type="email" value={fields.email} onChange={e=>set('email',e.target.value)} error={errors.email} placeholder="email@perusahaan.com"/>}
        <Input label={initial?'Password Baru (kosongkan jika tidak diubah)':'Password *'} type="password" value={fields.password||''} onChange={e=>set('password',e.target.value)} error={errors.password} placeholder={initial?'Biarkan kosong jika tidak diubah':'Min. 6 karakter'}/>
        <div className="flex flex-col gap-1.5"><label className="text-xs font-semibold text-ink-secondary tracking-wide">Role</label><select value={fields.role} onChange={e=>set('role',e.target.value)} className={sel}>{ROLE_OPTIONS.map(r=><option key={r.value} value={r.value}>{r.label}</option>)}</select></div>
      </div>
      <div className="flex gap-2 justify-end"><Button type="button" variant="secondary" size="sm" onClick={onCancel}>Batal</Button><Button type="submit" size="sm" loading={saving}>{initial?'Simpan':'Buat user'}</Button></div>
    </form>
  )
}

export default function UserManagement() {
  const { users,isLoading,saving,create,update,remove } = useUsers()
  const currentUserId = useAuthStore(s=>s.user?.id)
  const [showForm,setShowForm] = useState(false)
  const [editTarget,setEdit]   = useState(null)
  const [deleteTarget,setDelete] = useState(null)
  if(isLoading)return <div className="flex justify-center py-10"><Spinner size="lg" className="text-ink-faint"/></div>
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-muted font-medium">{users.length} user terdaftar</p>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4"/>} onClick={()=>setShowForm(true)}>Tambah user</Button>
      </div>
      {showForm && <div className="border border-brand-200 bg-brand-50/50 rounded-xl p-5">
        <p className="text-sm font-bold text-ink mb-4">User Baru</p>
        <UserForm onSubmit={async d=>{await create(d);setShowForm(false)}} onCancel={()=>setShowForm(false)} saving={saving}/>
      </div>}
      <div className="flex flex-col gap-2">
        {users.map(u=>{
          const roleCfg = ROLE_CONFIG[u.role]??{label:u.role,color:'bg-gray-100 text-gray-600'}
          const isMe = u.id===currentUserId
          return (
            <div key={u.id}>
              <div className={cn('flex items-center gap-4 p-4 rounded-xl border transition-colors',isMe?'border-brand-200 bg-brand-50/50':'border-surface-border bg-white hover:bg-surface-muted')}>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 text-sm font-bold shrink-0">{u.full_name?.charAt(0)?.toUpperCase()}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink truncate">{u.full_name}</p>
                    {isMe && <span className="text-2xs text-brand-600 font-bold">(Anda)</span>}
                    {(u.is_active===false||u.is_active==='FALSE') && <span className="text-2xs text-ink-faint">(Nonaktif)</span>}
                  </div>
                  <p className="text-2xs text-ink-faint">{u.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className={cn('inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-2xs font-semibold',roleCfg.color)}><Shield className="w-2.5 h-2.5"/>{roleCfg.label}</span>
                  <Button variant="ghost" size="icon" onClick={()=>setEdit(editTarget?.id===u.id?null:u)}><Edit2 className="w-3.5 h-3.5"/></Button>
                  {!isMe && <Button variant="ghost" size="icon" onClick={()=>setDelete(u)}><Trash2 className="w-3.5 h-3.5 text-red-500"/></Button>}
                </div>
              </div>
              {editTarget?.id===u.id && (
                <div className="border border-surface-border bg-surface-muted/50 rounded-xl p-5 mt-2">
                  <p className="text-sm font-bold text-ink mb-4">Edit: {editTarget.full_name}</p>
                  <UserForm initial={editTarget} onSubmit={async d=>{await update(editTarget.id,d);setEdit(null)}} onCancel={()=>setEdit(null)} saving={saving}/>
                </div>
              )}
            </div>
          )
        })}
      </div>
      {deleteTarget && <DeleteConfirmModal title="Hapus user" description={`"${deleteTarget.full_name}" akan dihapus permanen dan tidak bisa login lagi.`} onConfirm={async()=>{await remove(deleteTarget.id);setDelete(null)}} onCancel={()=>setDelete(null)} isLoading={saving}/>}
    </div>
  )
}
