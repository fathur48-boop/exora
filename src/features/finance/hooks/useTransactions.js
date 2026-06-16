import { useEffect, useCallback, useState } from 'react'
import { useFinanceStore } from '../store/financeStore.js'
import { fetchTransactions,createTransaction,updateTransaction,deleteTransaction,fetchFinanceSummary,bulkCreateTransactions } from '../services/transactionService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useTransactions() {
  const {transactions,transactionsLoaded,summary,summaryLoaded,setTransactions,setSummary,upsertTransaction,removeTransaction,invalidateSummary,setLoading,setError,isLoading,error} = useFinanceStore()
  const toast = useToast()
  const [saving,setSaving] = useState(false)
  const loadTransactions = useCallback(async()=>{setLoading(true);try{setTransactions(await fetchTransactions())}catch(e){setError(e.message)}},[setTransactions,setLoading,setError])
  const loadSummary = useCallback(async()=>{try{setSummary(await fetchFinanceSummary())}catch(_){}},[setSummary])
  useEffect(()=>{if(!transactionsLoaded)loadTransactions();if(!summaryLoaded)loadSummary()},[transactionsLoaded,summaryLoaded])
  const create = async(d)=>{setSaving(true);try{const t=await createTransaction(d);upsertTransaction(t);invalidateSummary();await loadSummary();toast.success('Transaksi ditambahkan');return t}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const update = async(id,d)=>{setSaving(true);try{const t=await updateTransaction(id,d);upsertTransaction(t);invalidateSummary();await loadSummary();toast.success('Transaksi diperbarui');return t}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const remove = async(id)=>{setSaving(true);try{await deleteTransaction(id);removeTransaction(id);invalidateSummary();await loadSummary();toast.success('Transaksi dihapus')}catch(e){toast.error(e.message);throw e}finally{setSaving(false)}}
  const reload = async()=>{await loadTransactions();await loadSummary()}
  const importRows = async(rows)=>{const results=await bulkCreateTransactions(rows);invalidateSummary();await reload();return results}
  return {transactions,summary,isLoading,saving,error,reload,create,update,remove,importRows}
}
