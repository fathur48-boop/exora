import { useEffect, useCallback, useState } from 'react'
import { useInventoryStore } from '../store/inventoryStore.js'
import { fetchMovements } from '../services/inventoryService.js'
export function useStockMovements(productId) {
  const {movements,movementsLoaded,setMovements} = useInventoryStore()
  const [isLoading,setIsLoading] = useState(false)
  const load = useCallback(async()=>{setIsLoading(true);try{setMovements(await fetchMovements(productId||null))}catch(_){}finally{setIsLoading(false)}},[productId])
  useEffect(()=>{if(!movementsLoaded)load()},[movementsLoaded,load])
  return {movements,isLoading,reload:load}
}
