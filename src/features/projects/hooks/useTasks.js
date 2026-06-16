import { useEffect, useCallback, useState } from 'react'
import { useProjectStore } from '../store/projectStore.js'
import { fetchTasks,createTask,updateTask,updateTaskStatus,deleteTask } from '../services/projectService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useTasks(projectId) {
  const {tasks,setTasks,upsertTask,removeTask} = useProjectStore()
  const [isLoading,setIsLoading] = useState(false)
  const [saving,setSaving] = useState(false)
  const toast = useToast()
  const list = tasks[projectId]??null
  const load = useCallback(async()=>{if(!projectId)return;setIsLoading(true);try{setTasks(projectId,await fetchTasks(projectId))}catch(_){}finally{setIsLoading(false)}},[projectId])
  useEffect(()=>{if(list===null)load()},[projectId])
  const create      = async(d)=>{setSaving(true);try{const t=await createTask({...d,project_id:projectId});upsertTask(projectId,t);toast.success('Task ditambahkan');return t}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const update      = async(id,d)=>{setSaving(true);try{const t=await updateTask(id,d);upsertTask(projectId,t);toast.success('Task diperbarui');return t}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const changeStatus = async(id,status)=>{try{const t=await updateTaskStatus(id,status);upsertTask(projectId,t)}catch(e){toast.error(e.message)}}
  const remove      = async(id)=>{try{await deleteTask(id);removeTask(projectId,id);toast.success('Task dihapus')}catch(e){toast.error(e.message)}}
  return {tasks:list??[],isLoading,saving,reload:load,create,update,changeStatus,remove}
}
