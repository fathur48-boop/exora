import { useEffect, useCallback } from 'react'
import { useReportsStore } from '../store/reportsStore.js'
import { fetchFullReport } from '../services/reportsService.js'
export function useReports() {
  const { report,isLoading,error,loadedAt,setLoading,setError,setReport } = useReportsStore()
  const load = useCallback(async()=>{setLoading(true);try{setReport(await fetchFullReport())}catch(e){setError(e.message)}},[setLoading,setError,setReport])
  useEffect(()=>{
    const CACHE=10*60*1000
    const stale=!loadedAt||(Date.now()-new Date(loadedAt).getTime())>CACHE
    if(stale)load()
  },[loadedAt,load])
  return { report,isLoading,error,reload:load }
}
