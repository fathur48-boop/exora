import { useEffect, useCallback, useState } from 'react'
import { useInventoryStore } from '../store/inventoryStore.js'
import { fetchProductById } from '../services/productService.js'
import { stockIn,stockOut,adjustStock,updateMinStock } from '../services/inventoryService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useProductDetail(productId) {
  const {activeProduct,setActiveProduct,upsertInventoryItem} = useInventoryStore()
  const [isLoading,setIsLoading] = useState(false)
  const [saving,setSaving] = useState(false)
  const toast = useToast()
  const load = useCallback(async()=>{if(!productId)return;setIsLoading(true);try{setActiveProduct(await fetchProductById(productId))}catch(e){toast.error(e.message)}finally{setIsLoading(false)}},[productId])
  useEffect(()=>{load();return()=>setActiveProduct(null)},[productId])
  const doStockIn  = async(d)=>{setSaving(true);try{const r=await stockIn({product_id:productId,...d});upsertInventoryItem(r);toast.success(`+${d.quantity} unit masuk`);return r}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const doStockOut = async(d)=>{setSaving(true);try{const r=await stockOut({product_id:productId,...d});upsertInventoryItem(r);toast.success(`-${d.quantity} unit keluar`);return r}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const doAdjust   = async(d)=>{setSaving(true);try{const r=await adjustStock({product_id:productId,...d});upsertInventoryItem(r);toast.success('Stok disesuaikan');return r}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const doUpdateMinStock = async(d)=>{setSaving(true);try{const r=await updateMinStock({product_id:productId,...d});upsertInventoryItem(r);toast.success('Pengaturan disimpan');return r}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  return {product:activeProduct,isLoading,saving,reload:load,doStockIn,doStockOut,doAdjust,doUpdateMinStock}
}
