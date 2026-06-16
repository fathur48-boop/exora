import { useEffect, useCallback, useState } from 'react'
import { useInventoryStore } from '../store/inventoryStore.js'
import { fetchInventory } from '../services/inventoryService.js'
import { createProduct,updateProduct,deleteProduct,bulkCreateProducts } from '../services/productService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useProducts() {
  const {inventory,inventoryLoaded,setInventory,upsertInventoryItem,removeInventoryItem,setLoading,setError,isLoading,error} = useInventoryStore()
  const toast = useToast()
  const [saving,setSaving] = useState(false)
  const load = useCallback(async()=>{setLoading(true);try{setInventory(await fetchInventory())}catch(e){setError(e.message)}},[setInventory,setLoading,setError])
  useEffect(()=>{if(!inventoryLoaded)load()},[inventoryLoaded,load])
  const create = async(d)=>{setSaving(true);try{await createProduct(d);await load();toast.success('Produk ditambahkan')}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const update = async(id,d)=>{setSaving(true);try{const u=await updateProduct(id,d);upsertInventoryItem({product_id:id,...u});toast.success('Produk diperbarui')}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const remove = async(pid)=>{setSaving(true);try{await deleteProduct(pid);removeInventoryItem(pid);toast.success('Produk dihapus')}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const importRows = async(rows)=>{const results=await bulkCreateProducts(rows);await load();return results}
  return {inventory,isLoading,saving,error,load,create,update,remove,importRows}
}
