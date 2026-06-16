import apiClient from '../../../shared/lib/axios.js'
import { isSupabase } from '../../../shared/lib/crudAdapter.js'
import * as agg from '../../../shared/lib/reportsAggregation.js'

export async function fetchFullReport() {
  if (isSupabase()) return agg.getFullReport()
  return (await apiClient.post('', { action: 'reports.getFullReport', payload: {} })).data.data
}
export async function fetchRevenueReport() {
  if (isSupabase()) return agg.getRevenueReport()
  return (await apiClient.post('', { action: 'reports.getRevenueReport', payload: {} })).data.data
}
export async function fetchLeadsReport() {
  if (isSupabase()) return agg.getLeadsReport()
  return (await apiClient.post('', { action: 'reports.getLeadsReport', payload: {} })).data.data
}
export async function fetchInventoryReport() {
  if (isSupabase()) return agg.getInventoryReport()
  return (await apiClient.post('', { action: 'reports.getInventoryReport', payload: {} })).data.data
}
export async function fetchHrReport() {
  if (isSupabase()) return agg.getHrReport()
  return (await apiClient.post('', { action: 'reports.getHrReport', payload: {} })).data.data
}
export async function fetchProjectsReport() {
  if (isSupabase()) return agg.getProjectsReport()
  return (await apiClient.post('', { action: 'reports.getProjectsReport', payload: {} })).data.data
}
