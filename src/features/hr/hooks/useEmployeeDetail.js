import { useEffect, useCallback, useState } from 'react'
import { useHrStore } from '../store/hrStore.js'
import { fetchEmployeeById } from '../services/hrService.js'
export function useEmployeeDetail(id) {
  const {activeEmployee,setActiveEmployee} = useHrStore()
  const [isLoading,setIsLoading] = useState(false)
  const load = useCallback(async()=>{if(!id)return;setIsLoading(true);try{setActiveEmployee(await fetchEmployeeById(id))}catch(_){}finally{setIsLoading(false)}},[id])
  useEffect(()=>{load();return()=>setActiveEmployee(null)},[id])
  return {employee:activeEmployee,isLoading,reload:load}
}
