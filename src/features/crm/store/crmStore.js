import { create } from 'zustand'
export const useCrmStore = create((set, get) => ({
  customers:[], customersLoaded:false, leads:[], leadsLoaded:false,
  activeCustomer:null, activeLead:null, activities:{}, isLoading:false, error:null,
  setLoading:(v)=>set({isLoading:v}), setError:(e)=>set({error:e,isLoading:false}),
  setCustomers:(d)=>set({customers:d,customersLoaded:true,isLoading:false,error:null}),
  setActiveCustomer:(c)=>set({activeCustomer:c}),
  upsertCustomer:(c)=>{const l=get().customers,i=l.findIndex(x=>x.id===c.id); set({customers:i===-1?[c,...l]:l.map((x,j)=>j===i?c:x)})},
  removeCustomer:(id)=>set({customers:get().customers.filter(c=>c.id!==id)}),
  setLeads:(d)=>set({leads:d,leadsLoaded:true,isLoading:false,error:null}),
  setActiveLead:(l)=>set({activeLead:l}),
  upsertLead:(l)=>{const ls=get().leads,i=ls.findIndex(x=>x.id===l.id); set({leads:i===-1?[l,...ls]:ls.map((x,j)=>j===i?l:x)})},
  removeLead:(id)=>set({leads:get().leads.filter(l=>l.id!==id)}),
  setActivities:(eid,list)=>set({activities:{...get().activities,[eid]:list}}),
  prependActivity:(eid,a)=>set({activities:{...get().activities,[eid]:[a,...(get().activities[eid]??[])]}}),
  removeActivity:(eid,aid)=>set({activities:{...get().activities,[eid]:(get().activities[eid]??[]).filter(a=>a.id!==aid)}}),
}))
