import { useEffect, useCallback, useState } from 'react'
import { useCrmStore } from '../store/crmStore.js'
import { fetchCustomers,createCustomer,updateCustomer,deleteCustomer,bulkCreateCustomers } from '../services/customerService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useCustomers() {
  const { customers,customersLoaded,setCustomers,upsertCustomer,removeCustomer,setLoading,setError,isLoading,error } = useCrmStore()
  const toast = useToast()
  const [saving,setSaving] = useState(false)
  const load = useCallback(async()=>{setLoading(true);try{setCustomers(await fetchCustomers())}catch(e){setError(e.message)}},[setCustomers,setLoading,setError])
  useEffect(()=>{if(!customersLoaded)load()},[customersLoaded,load])
  const create = async(d)=>{setSaving(true);try{const c=await createCustomer(d);upsertCustomer(c);toast.success('Customer ditambahkan');return c}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const update = async(id,d)=>{setSaving(true);try{const c=await updateCustomer(id,d);upsertCustomer(c);toast.success('Customer diperbarui');return c}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const remove = async(id)=>{setSaving(true);try{await deleteCustomer(id);removeCustomer(id);toast.success('Customer dihapus')}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const importRows = async(rows)=>{const results=await bulkCreateCustomers(rows);await load();return results}
  return {customers,isLoading,saving,error,load,create,update,remove,importRows}
}
