import { useEffect, useCallback, useState } from 'react'
import { useProjectStore }  from '../store/projectStore.js'
import { fetchProjectById } from '../services/projectService.js'
export function useProjectDetail(id) {
  const {activeProject,setActiveProject} = useProjectStore()
  const [isLoading,setIsLoading] = useState(false)
  const load = useCallback(async()=>{if(!id)return;setIsLoading(true);try{setActiveProject(await fetchProjectById(id))}catch(_){}finally{setIsLoading(false)}},[id])
  useEffect(()=>{load();return()=>setActiveProject(null)},[id])
  return {project:activeProject,isLoading,reload:load}
}
