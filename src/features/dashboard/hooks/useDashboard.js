import { useEffect, useCallback } from 'react'
import { useDashboardStore }     from '../store/dashboardStore.js'
import { fetchDashboardSummary } from '../services/dashboardService.js'
export function useDashboard() {
  const { stats, revenueTrend, leadsPipeline, isLoading, error, lastFetchedAt,
    setLoading, setDashboardData, setError } = useDashboardStore()
  const load = useCallback(async () => {
    setLoading(true)
    try { setDashboardData(await fetchDashboardSummary()) }
    catch (err) { setError(err.message) }
  }, [setLoading, setDashboardData, setError])
  useEffect(() => {
    const CACHE = 5*60*1000
    const stale = !lastFetchedAt || (Date.now()-new Date(lastFetchedAt).getTime()) > CACHE
    if (stale) load()
  }, [lastFetchedAt, load])
  return { stats, revenueTrend, leadsPipeline, isLoading, error, refresh: load }
}
