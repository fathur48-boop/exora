import { create } from 'zustand'
export const useFinanceStore = create((set,get)=>({
  transactions:[],transactionsLoaded:false,summary:null,summaryLoaded:false,activeTransaction:null,isLoading:false,error:null,
  setLoading:(v)=>set({isLoading:v}),setError:(e)=>set({error:e,isLoading:false}),
  setTransactions:(d)=>set({transactions:d,transactionsLoaded:true,isLoading:false,error:null}),
  setSummary:(d)=>set({summary:d,summaryLoaded:true,isLoading:false}),
  setActiveTransaction:(t)=>set({activeTransaction:t}),
  upsertTransaction:(t)=>{const l=get().transactions,i=l.findIndex(x=>x.id===t.id);set({transactions:i===-1?[t,...l]:l.map((x,j)=>j===i?t:x)})},
  removeTransaction:(id)=>set({transactions:get().transactions.filter(t=>t.id!==id)}),
  invalidateSummary:()=>set({summaryLoaded:false}),
}))
