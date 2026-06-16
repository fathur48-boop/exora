import { useEffect, useCallback, useState } from 'react'
import { useCrmStore } from '../store/crmStore.js'
import { fetchActivities,createActivity,deleteActivity } from '../services/activityService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useActivities(entityType, entityId) {
  const {activities,setActivities,prependActivity,removeActivity} = useCrmStore()
  const [isLoading,setIsLoading] = useState(false)
  const [saving,setSaving] = useState(false)
  const toast = useToast()
  const list = activities[entityId] ?? null
  const load = useCallback(async()=>{if(!entityId)return;setIsLoading(true);try{setActivities(entityId,await fetchActivities(entityType,entityId))}catch(e){toast.error(e.message)}finally{setIsLoading(false)}},[entityType,entityId])
  useEffect(()=>{if(list===null)load()},[entityId])
  const create = async(d)=>{setSaving(true);try{const a=await createActivity({...d,entity_type:entityType,entity_id:entityId});prependActivity(entityId,a);toast.success('Aktivitas dicatat');return a}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const remove = async(aid)=>{try{await deleteActivity(aid);removeActivity(entityId,aid);toast.success('Aktivitas dihapus')}catch(e){toast.error(e.message)}}
  return {activities:list??[],isLoading,saving,load,create,remove}
}
