import { useState, useCallback, useEffect } from 'react'
import { fetchSales, fetchSaleById, processSaleRefund } from '../services/posService.js'
import { useToast } from '../../../shared/hooks/useToast.js'
export function useSalesHistory(autoLoad = true) {
  const [sales, setSales]       = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [saving, setSaving]     = useState(false)
  const toast = useToast()
  const today = new Date().toISOString().slice(0, 10)
  const [dateFrom, setDateFrom] = useState(today)
  const [dateTo,   setDateTo]   = useState(today)

  const load = useCallback(async () => {
    setIsLoading(true)
    try { setSales(await fetchSales({ dateFrom, dateTo })) }
    catch (e) { toast.error(e.message) }
    finally { setIsLoading(false) }
  }, [dateFrom, dateTo])

  useEffect(() => { if (autoLoad) load() }, [dateFrom, dateTo])

  const getDetail = async (id) => {
    try { return await fetchSaleById(id) } catch (e) { toast.error(e.message); return null }
  }

  const refund = async (id) => {
    setSaving(true)
    try { await processSaleRefund(id); toast.success('Refund berhasil'); await load() }
    catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  return { sales, isLoading, saving, dateFrom, dateTo, setDateFrom, setDateTo, reload: load, getDetail, refund }
}
