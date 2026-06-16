import { useEffect, useCallback } from 'react'
import { useCrmStore } from '../store/crmStore.js'
import { fetchLeadById } from '../services/leadService.js'
export function useLeadDetail(id) {
  const {activeLead,setActiveLead,setLoading,setError,isLoading} = useCrmStore()
  const load = useCallback(async()=>{if(!id)return;setLoading(true);try{setActiveLead(await fetchLeadById(id))}catch(e){setError(e.message)}},[id,setActiveLead,setLoading,setError])
  useEffect(()=>{load();return()=>setActiveLead(null)},[id])
  return {lead:activeLead,isLoading,reload:load}
}
