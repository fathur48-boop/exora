import { useEffect, useCallback, useState } from 'react'
import { useHrStore } from '../store/hrStore.js'
import { fetchEmployees,fetchHrSummary,createEmployee,updateEmployee,deleteEmployee,bulkCreateEmployees } from '../services/hrService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useEmployees() {
  const {employees,employeesLoaded,summary,setEmployees,setSummary,upsertEmployee,removeEmployee,setLoading,setError,isLoading,error} = useHrStore()
  const toast = useToast()
  const [saving,setSaving] = useState(false)
  const load = useCallback(async()=>{setLoading(true);try{const [d,s]=await Promise.all([fetchEmployees(),fetchHrSummary()]);setEmployees(d);setSummary(s)}catch(e){setError(e.message)}},[setEmployees,setSummary,setLoading,setError])
  useEffect(()=>{if(!employeesLoaded)load()},[employeesLoaded,load])
  const create = async(d)=>{setSaving(true);try{const e=await createEmployee(d);upsertEmployee(e);toast.success('Karyawan ditambahkan');return e}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const update = async(id,d)=>{setSaving(true);try{const e=await updateEmployee(id,d);upsertEmployee(e);toast.success('Karyawan diperbarui');return e}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const remove = async(id)=>{setSaving(true);try{await deleteEmployee(id);removeEmployee(id);toast.success('Karyawan dihapus')}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const importRows = async(rows)=>{const results=await bulkCreateEmployees(rows);await load();return results}
  return {employees,summary,isLoading,saving,error,reload:load,create,update,remove,importRows}
}
