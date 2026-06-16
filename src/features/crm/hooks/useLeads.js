import { useEffect, useCallback, useState } from 'react'
import { useCrmStore } from '../store/crmStore.js'
import { fetchLeads,createLead,updateLead,updateLeadStage,deleteLead,bulkCreateLeads } from '../services/leadService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useLeads() {
  const {leads,leadsLoaded,setLeads,upsertLead,removeLead,setLoading,setError,isLoading,error} = useCrmStore()
  const toast = useToast()
  const [saving,setSaving] = useState(false)
  const load = useCallback(async()=>{setLoading(true);try{setLeads(await fetchLeads())}catch(e){setError(e.message)}},[setLeads,setLoading,setError])
  useEffect(()=>{if(!leadsLoaded)load()},[leadsLoaded,load])
  const create      = async(d)=>{setSaving(true);try{const l=await createLead(d);upsertLead(l);toast.success('Lead dibuat');return l}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const update      = async(id,d)=>{setSaving(true);try{const l=await updateLead(id,d);upsertLead(l);toast.success('Lead diperbarui');return l}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const changeStage = async(id,stage)=>{try{const l=await updateLeadStage(id,stage);upsertLead(l);return l}catch(e){toast.error(e.message);throw e}}
  const remove      = async(id)=>{setSaving(true);try{await deleteLead(id);removeLead(id);toast.success('Lead dihapus')}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const importRows = async(rows)=>{const results=await bulkCreateLeads(rows);await load();return results}
  return {leads,isLoading,saving,error,load,create,update,changeStage,remove,importRows}
}
