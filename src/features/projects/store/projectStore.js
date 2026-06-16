import { create } from 'zustand'
export const useProjectStore = create((set,get)=>({
  projects:[],projectsLoaded:false,summary:null,tasks:{},activeProject:null,isLoading:false,error:null,
  setLoading:(v)=>set({isLoading:v}),setError:(e)=>set({error:e,isLoading:false}),
  setProjects:(d)=>set({projects:d,projectsLoaded:true,isLoading:false,error:null}),
  setSummary:(d)=>set({summary:d}),
  setActiveProject:(p)=>set({activeProject:p}),
  upsertProject:(p)=>{const l=get().projects,i=l.findIndex(x=>x.id===p.id);set({projects:i===-1?[p,...l]:l.map((x,j)=>j===i?p:x)})},
  removeProject:(id)=>set({projects:get().projects.filter(p=>p.id!==id)}),
  setTasks:(pid,tasks)=>set({tasks:{...get().tasks,[pid]:tasks}}),
  upsertTask:(pid,task)=>{const c=get().tasks[pid]??[],i=c.findIndex(t=>t.id===task.id);set({tasks:{...get().tasks,[pid]:i===-1?[...c,task]:c.map((t,j)=>j===i?task:t)}})},
  removeTask:(pid,tid)=>set({tasks:{...get().tasks,[pid]:(get().tasks[pid]??[]).filter(t=>t.id!==tid)}}),
}))
