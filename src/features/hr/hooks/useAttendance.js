import { useCallback, useState } from 'react'
import { useHrStore } from '../store/hrStore.js'
import { fetchAttendanceByDate,fetchAttendanceByEmployee,recordAttendance,fetchMonthlySummary } from '../services/hrService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useAttendance() {
  const {attendance,setAttendance} = useHrStore()
  const [isLoading,setIsLoading] = useState(false)
  const [saving,setSaving] = useState(false)
  const toast = useToast()
  const loadByDate = useCallback(async(date)=>{setIsLoading(true);try{const d=await fetchAttendanceByDate(date);setAttendance(`date_${date}`,d);return d}catch(_){return[]}finally{setIsLoading(false)}},[])
  const loadByEmployee = useCallback(async(employeeId)=>{setIsLoading(true);try{const d=await fetchAttendanceByEmployee(employeeId);setAttendance(`emp_${employeeId}`,d);return d}catch(_){return[]}finally{setIsLoading(false)}},[])
  const loadMonthlySummary = useCallback(async(employeeId,year,month)=>{setIsLoading(true);try{const d=await fetchMonthlySummary(employeeId,year,month);setAttendance(`monthly_${employeeId}_${year}_${month}`,d);return d}catch(_){return null}finally{setIsLoading(false)}},[])
  const record = async(d)=>{setSaving(true);try{const r=await recordAttendance(d);toast.success('Kehadiran dicatat');return r}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  return {attendance,isLoading,saving,loadByDate,loadByEmployee,loadMonthlySummary,record}
}
