import { create } from 'zustand'
export const useInventoryStore = create((set,get)=>({
  inventory:[],inventoryLoaded:false,movements:[],movementsLoaded:false,activeProduct:null,isLoading:false,error:null,
  setLoading:(v)=>set({isLoading:v}),setError:(e)=>set({error:e,isLoading:false}),
  setInventory:(d)=>set({inventory:d,inventoryLoaded:true,isLoading:false,error:null}),
  upsertInventoryItem:(item)=>{const l=get().inventory,i=l.findIndex(x=>x.product_id===item.product_id);set({inventory:i===-1?[item,...l]:l.map((x,j)=>j===i?{...x,...item}:x)})},
  removeInventoryItem:(pid)=>set({inventory:get().inventory.filter(i=>i.product_id!==pid)}),
  setMovements:(d)=>set({movements:d,movementsLoaded:true,isLoading:false}),
  prependMovement:(m)=>set({movements:[m,...get().movements]}),
  setActiveProduct:(p)=>set({activeProduct:p}),
}))
