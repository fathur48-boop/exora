import { useEffect, useCallback, useState } from 'react'
import { useCrmStore } from '../store/crmStore.js'
import { fetchCustomerById } from '../services/customerService.js'

export function useCustomerDetail(id) {
  const { activeCustomer, setActiveCustomer, setError } = useCrmStore()
  const [isLoading, setIsLoading] = useState(false)

  const load = useCallback(async () => {
    if (!id) return
    setIsLoading(true)
    try {
      setActiveCustomer(await fetchCustomerById(id))
    } catch (e) {
      setError(e.message)
    } finally {
      setIsLoading(false)
    }
  }, [id, setActiveCustomer, setError])

  useEffect(() => {
    load()
    return () => setActiveCustomer(null)
  }, [id])

  return { customer: activeCustomer, isLoading, reload: load }
}
