import { useEffect, useCallback, useState } from 'react'
import { useFinanceStore } from '../store/financeStore.js'
import { fetchTransactionById } from '../services/transactionService.js'
export function useTransactionDetail(id) {
  const {activeTransaction,setActiveTransaction} = useFinanceStore()
  const [isLoading,setIsLoading] = useState(false)
  const load = useCallback(async()=>{if(!id)return;setIsLoading(true);try{setActiveTransaction(await fetchTransactionById(id))}catch(_){}finally{setIsLoading(false)}},[id])
  useEffect(()=>{load();return()=>setActiveTransaction(null)},[id])
  return {transaction:activeTransaction,isLoading,reload:load}
}
