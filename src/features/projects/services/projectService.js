import apiClient from '../../../shared/lib/axios.js'
import { supabase } from '../../../shared/lib/supabaseClient.js'
import { createCrudAdapter, isSupabase } from '../../../shared/lib/crudAdapter.js'

const projectAdapter = createCrudAdapter({
  table: 'projects',
  gas: {
    getAll: 'projects.getProjects',
    getById: 'projects.getProject',
    create: 'projects.createProject',
    update: 'projects.updateProject',
    remove: 'projects.deleteProject',
  },
  order: { column: 'created_at', ascending: false },
})

const taskAdapter = createCrudAdapter({
  table: 'tasks',
  gas: {
    getAll: 'projects.getTasks',
    create: 'projects.createTask',
    update: 'projects.updateTask',
    remove: 'projects.deleteTask',
  },
  order: { column: 'created_at', ascending: true },
})

export const fetchProjects    = () => projectAdapter.getAll()
export const fetchProjectById = (id) => projectAdapter.getById(id)
export const createProject    = (data) => projectAdapter.create(data)
export const updateProject    = (id, data) => projectAdapter.update(id, data)
export const deleteProject    = (id) => projectAdapter.remove(id)

export const fetchTasks        = (projectId) => taskAdapter.getAll({ project_id: projectId })
export const createTask        = (data) => taskAdapter.create(data)
export const updateTask        = (id, data) => taskAdapter.update(id, data)
export const updateTaskStatus  = (id, status) => taskAdapter.update(id, { status })
export const deleteTask        = (id) => taskAdapter.remove(id)

export async function fetchProjectSummary() {
  if (isSupabase()) {
    const { data: projects, error } = await supabase.from('projects').select('*')
    if (error) throw new Error(error.message)
    const STATUSES = ['planning','active','on_hold','completed','cancelled']
    const byStatus = {}
    STATUSES.forEach(s => byStatus[s] = 0)
    let totalBudget = 0, totalSpent = 0, overdue = 0
    const now = new Date()
    projects.forEach(p => {
      const s = p.status || 'planning'
      if (byStatus[s] !== undefined) byStatus[s]++
      totalBudget += parseFloat(p.budget) || 0
      totalSpent  += parseFloat(p.spent) || 0
      if (p.end_date && new Date(p.end_date) < now && s !== 'completed' && s !== 'cancelled') overdue++
    })
    return { total: projects.length, by_status: byStatus, total_budget: totalBudget, total_spent: totalSpent, overdue }
  }
  return (await apiClient.post('', { action: 'projects.getSummary', payload: {} })).data.data
}
