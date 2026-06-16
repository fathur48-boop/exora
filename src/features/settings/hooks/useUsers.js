import { useEffect, useCallback, useState } from 'react'
import { useSettingsStore } from '../store/settingsStore.js'
import { fetchUsers,createUser,updateUser,deleteUser } from '../services/settingsService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useUsers() {
  const { users,usersLoaded,setUsers,upsertUser,removeUser } = useSettingsStore()
  const [isLoading,setIsLoading] = useState(false)
  const [saving,setSaving] = useState(false)
  const toast = useToast()
  const load = useCallback(async()=>{setIsLoading(true);try{setUsers(await fetchUsers())}catch(_){}finally{setIsLoading(false)}},[])
  useEffect(()=>{if(!usersLoaded)load()},[usersLoaded,load])
  const create = async(d)=>{setSaving(true);try{const u=await createUser(d);upsertUser(u);toast.success('User dibuat');return u}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const update = async(id,d)=>{setSaving(true);try{const u=await updateUser(id,d);upsertUser(u);toast.success('User diperbarui');return u}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const remove = async(id)=>{setSaving(true);try{await deleteUser(id);removeUser(id);toast.success('User dihapus')}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  return { users,isLoading,saving,reload:load,create,update,remove }
}
