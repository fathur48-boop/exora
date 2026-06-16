import { useEffect, useCallback, useState } from 'react'
import { useHrStore } from '../store/hrStore.js'
import { fetchLeaveRequests,createLeave,updateLeaveStatus,deleteLeave } from '../services/hrService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useLeaveRequests() {
  const {leaveRequests,leaveLoaded,setLeaveRequests,upsertLeave,removeLeave} = useHrStore()
  const [isLoading,setIsLoading] = useState(false)
  const [saving,setSaving] = useState(false)
  const toast = useToast()
  const load = useCallback(async()=>{setIsLoading(true);try{setLeaveRequests(await fetchLeaveRequests())}catch(_){}finally{setIsLoading(false)}},[])
  useEffect(()=>{if(!leaveLoaded)load()},[leaveLoaded,load])
  const create  = async(d)=>{setSaving(true);try{const l=await createLeave(d);upsertLeave(l);toast.success('Pengajuan cuti dikirim');return l}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const approve = async(id)=>{try{const l=await updateLeaveStatus(id,'approved');upsertLeave(l);toast.success('Cuti disetujui')}catch(e){toast.error(e.message)}}
  const reject  = async(id)=>{try{const l=await updateLeaveStatus(id,'rejected');upsertLeave(l);toast.success('Cuti ditolak')}catch(e){toast.error(e.message)}}
  const remove  = async(id)=>{try{await deleteLeave(id);removeLeave(id);toast.success('Pengajuan dihapus')}catch(e){toast.error(e.message)}}
  return {leaveRequests,isLoading,saving,reload:load,create,approve,reject,remove}
}
