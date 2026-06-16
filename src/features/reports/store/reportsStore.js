import { create } from 'zustand'
export const useReportsStore = create((set)=>({
  report:null,isLoading:false,error:null,loadedAt:null,
  setLoading:(v)=>set({isLoading:v}),
  setError:(e)=>set({error:e,isLoading:false}),
  setReport:(r)=>set({report:r,isLoading:false,error:null,loadedAt:new Date().toISOString()}),
}))
