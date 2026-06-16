import { create } from 'zustand'
export const useSettingsStore = create((set,get)=>({
  settings:null,settingsLoaded:false,users:[],usersLoaded:false,isLoading:false,error:null,
  setLoading:(v)=>set({isLoading:v}),setError:(e)=>set({error:e,isLoading:false}),
  setSettings:(s)=>set({settings:s,settingsLoaded:true,isLoading:false,error:null}),
  updateSettings:(partial)=>set({settings:{...get().settings,...partial}}),
  setUsers:(u)=>set({users:u,usersLoaded:true,isLoading:false}),
  upsertUser:(user)=>{const l=get().users,i=l.findIndex(x=>x.id===user.id);set({users:i===-1?[user,...l]:l.map((x,j)=>j===i?user:x)})},
  removeUser:(id)=>set({users:get().users.filter(u=>u.id!==id)}),
}))
