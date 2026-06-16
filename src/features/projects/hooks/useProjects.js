import { useEffect, useCallback, useState } from 'react'
import { useProjectStore } from '../store/projectStore.js'
import { fetchProjects,fetchProjectSummary,createProject,updateProject,deleteProject } from '../services/projectService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useProjects() {
  const {projects,projectsLoaded,summary,setProjects,setSummary,upsertProject,removeProject,setLoading,setError,isLoading,error} = useProjectStore()
  const toast = useToast()
  const [saving,setSaving] = useState(false)
  const load = useCallback(async()=>{setLoading(true);try{const [d,s]=await Promise.all([fetchProjects(),fetchProjectSummary()]);setProjects(d);setSummary(s)}catch(e){setError(e.message)}},[setProjects,setSummary,setLoading,setError])
  useEffect(()=>{if(!projectsLoaded)load()},[projectsLoaded,load])
  const create = async(d)=>{setSaving(true);try{const p=await createProject(d);upsertProject(p);toast.success('Project dibuat');return p}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const update = async(id,d)=>{setSaving(true);try{const p=await updateProject(id,d);upsertProject(p);toast.success('Project diperbarui');return p}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const remove = async(id)=>{setSaving(true);try{await deleteProject(id);removeProject(id);toast.success('Project dihapus')}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  return {projects,summary,isLoading,saving,error,reload:load,create,update,remove}
}
