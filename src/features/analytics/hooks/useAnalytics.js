import { useEffect, useCallback } from 'react'
import { useAnalyticsStore }  from '../store/analyticsStore.js'
import { fetchAnalyticsData } from '../services/analyticsService.js'
export function useAnalytics() {
  const { analytics,isLoading,error,loadedAt,setLoading,setError,setAnalytics } = useAnalyticsStore()
  const load = useCallback(async()=>{setLoading(true);try{setAnalytics(await fetchAnalyticsData())}catch(e){setError(e.message)}},[setLoading,setError,setAnalytics])
  useEffect(()=>{
    const CACHE=10*60*1000
    const stale=!loadedAt||(Date.now()-new Date(loadedAt).getTime())>CACHE
    if(stale)load()
  },[loadedAt,load])
  return { analytics,isLoading,error,reload:load }
}
