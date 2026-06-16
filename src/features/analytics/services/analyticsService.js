import apiClient from '../../../shared/lib/axios.js'
import { isSupabase } from '../../../shared/lib/crudAdapter.js'
import { getFullReport } from '../../../shared/lib/reportsAggregation.js'

export async function fetchAnalyticsData() {
  if (isSupabase()) return getFullReport()
  return (await apiClient.post('', { action: 'reports.getFullReport', payload: {} })).data.data
}
