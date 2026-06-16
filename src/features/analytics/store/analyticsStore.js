import { create } from 'zustand'
export const useAnalyticsStore = create((set)=>({
  analytics:null,isLoading:false,error:null,loadedAt:null,
  setLoading:(v)=>set({isLoading:v}),
  setError:(e)=>set({error:e,isLoading:false}),
  setAnalytics:(a)=>set({analytics:a,isLoading:false,error:null,loadedAt:new Date().toISOString()}),
}))
