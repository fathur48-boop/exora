import { create } from 'zustand'
export const useHrStore = create((set,get)=>({
  employees:[],employeesLoaded:false,summary:null,activeEmployee:null,attendance:{},leaveRequests:[],leaveLoaded:false,isLoading:false,error:null,
  setLoading:(v)=>set({isLoading:v}),setError:(e)=>set({error:e,isLoading:false}),
  setEmployees:(d)=>set({employees:d,employeesLoaded:true,isLoading:false,error:null}),
  setSummary:(d)=>set({summary:d}),
  setActiveEmployee:(e)=>set({activeEmployee:e}),
  upsertEmployee:(e)=>{const l=get().employees,i=l.findIndex(x=>x.id===e.id);set({employees:i===-1?[e,...l]:l.map((x,j)=>j===i?e:x)})},
  removeEmployee:(id)=>set({employees:get().employees.filter(e=>e.id!==id)}),
  setAttendance:(key,d)=>set({attendance:{...get().attendance,[key]:d}}),
  setLeaveRequests:(d)=>set({leaveRequests:d,leaveLoaded:true}),
  upsertLeave:(l)=>{const ls=get().leaveRequests,i=ls.findIndex(x=>x.id===l.id);set({leaveRequests:i===-1?[l,...ls]:ls.map((x,j)=>j===i?l:x)})},
  removeLeave:(id)=>set({leaveRequests:get().leaveRequests.filter(l=>l.id!==id)}),
}))
