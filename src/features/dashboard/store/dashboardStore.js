import { create } from 'zustand'
const INITIAL = { stats:null, revenueTrend:[], leadsPipeline:[], isLoading:false, error:null, lastFetchedAt:null }
export const useDashboardStore = create((set) => ({
  ...INITIAL,
  setLoading:       (isLoading) => set({ isLoading }),
  setDashboardData: ({ stats, revenue_trend, leads_pipeline }) =>
    set({ stats, revenueTrend:revenue_trend, leadsPipeline:leads_pipeline, isLoading:false, error:null, lastFetchedAt:new Date().toISOString() }),
  setError: (error) => set({ error, isLoading:false }),
  reset:    ()      => set(INITIAL),
}))
