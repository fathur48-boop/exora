import apiClient from '../../../shared/lib/axios.js'
import { supabase } from '../../../shared/lib/supabaseClient.js'
import { createCrudAdapter, isSupabase } from '../../../shared/lib/crudAdapter.js'

const employeeAdapter = createCrudAdapter({
  table: 'employees',
  gas: {
    getAll: 'hr.getEmployees',
    getById: 'hr.getEmployee',
    create: 'hr.createEmployee',
    update: 'hr.updateEmployee',
    remove: 'hr.deleteEmployee',
  },
  order: { column: 'created_at', ascending: false },
})

export const fetchEmployees    = () => employeeAdapter.getAll()
export const fetchEmployeeById = (id) => employeeAdapter.getById(id)
export const createEmployee    = (data) => employeeAdapter.create(data)
export const updateEmployee    = (id, data) => employeeAdapter.update(id, data)
export const deleteEmployee    = (id) => employeeAdapter.remove(id)
export const bulkCreateEmployees = (rows) => employeeAdapter.bulkCreate(rows)

export async function fetchHrSummary() {
  if (isSupabase()) {
    const { data: employees, error } = await supabase.from('employees').select('*')
    if (error) throw new Error(error.message)
    const STATUSES = ['active','inactive','on_leave']
    const byStatus = {}
    STATUSES.forEach(s => byStatus[s] = 0)
    const byDept = {}
    let totalSalary = 0
    employees.forEach(e => {
      if (byStatus[e.status] !== undefined) byStatus[e.status]++
      if (e.status === 'active') totalSalary += parseFloat(e.salary) || 0
      if (e.department) byDept[e.department] = (byDept[e.department] || 0) + 1
    })
    return { total: employees.length, by_status: byStatus, total_salary: totalSalary, by_department: byDept }
  }
  return (await apiClient.post('', { action: 'hr.getSummary', payload: {} })).data.data
}

// ---------------------------------------------------------------------------
// Attendance
// ---------------------------------------------------------------------------
export async function fetchAttendanceByEmployee(employeeId) {
  if (isSupabase()) {
    const { data, error } = await supabase.from('attendance').select('*').eq('employee_id', employeeId).order('date', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }
  return (await apiClient.post('', { action: 'hr.getAttendanceByEmployee', payload: { employee_id: employeeId } })).data.data
}

export async function fetchAttendanceByDate(date) {
  if (isSupabase()) {
    const { data, error } = await supabase.from('attendance').select('*, employees(full_name, department, role)').eq('date', date)
    if (error) throw new Error(error.message)
    return data.map(r => ({
      ...r,
      employee_name: r.employees?.full_name || '',
      employee_department: r.employees?.department || '',
      employee_role: r.employees?.role || '',
    }))
  }
  return (await apiClient.post('', { action: 'hr.getAttendanceByDate', payload: { date } })).data.data
}

export async function recordAttendance(data) {
  if (isSupabase()) {
    const { data: existing } = await supabase.from('attendance').select('*')
      .eq('employee_id', data.employee_id).eq('date', data.date).maybeSingle()
    if (existing) {
      const partial = {
        status: data.status || existing.status,
        check_in: data.check_in !== undefined ? data.check_in : existing.check_in,
        check_out: data.check_out !== undefined ? data.check_out : existing.check_out,
        notes: data.notes !== undefined ? data.notes : existing.notes,
      }
      const { data: updated, error } = await supabase.from('attendance').update(partial).eq('id', existing.id).select().single()
      if (error) throw new Error(error.message)
      return updated
    }
    const row = {
      employee_id: data.employee_id, date: data.date || new Date().toISOString().slice(0,10),
      status: data.status || 'present', check_in: data.check_in || '', check_out: data.check_out || '',
      notes: data.notes || '',
    }
    const { data: created, error } = await supabase.from('attendance').insert(row).select().single()
    if (error) throw new Error(error.message)
    return created
  }
  return (await apiClient.post('', { action: 'hr.recordAttendance', payload: data })).data.data
}

export async function fetchMonthlySummary(employeeId, year, month) {
  if (isSupabase()) {
    const start = `${year}-${String(month).padStart(2,'0')}-01`
    const endDate = new Date(year, month, 0).getDate()
    const end = `${year}-${String(month).padStart(2,'0')}-${String(endDate).padStart(2,'0')}`
    const { data: records, error } = await supabase.from('attendance').select('*')
      .eq('employee_id', employeeId).gte('date', start).lte('date', end).order('date', { ascending: true })
    if (error) throw new Error(error.message)
    const summary = { present: 0, absent: 0, late: 0, leave: 0, holiday: 0 }
    records.forEach(r => { if (summary[r.status] !== undefined) summary[r.status]++ })
    return { employee_id: employeeId, year, month, summary, records }
  }
  return (await apiClient.post('', { action: 'hr.getMonthlySummary', payload: { employee_id: employeeId, year, month } })).data.data
}

// ---------------------------------------------------------------------------
// Leave Requests
// ---------------------------------------------------------------------------
export async function fetchLeaveRequests() {
  if (isSupabase()) {
    const { data, error } = await supabase.from('leave_requests').select('*, employees(full_name, department)').order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data.map(l => ({ ...l, employee_name: l.employees?.full_name || '', employee_department: l.employees?.department || '' }))
  }
  return (await apiClient.post('', { action: 'hr.getLeaveRequests', payload: {} })).data.data
}

export async function fetchLeaveByEmployee(employeeId) {
  if (isSupabase()) {
    const { data, error } = await supabase.from('leave_requests').select('*').eq('employee_id', employeeId).order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return data
  }
  return (await apiClient.post('', { action: 'hr.getLeaveByEmployee', payload: { employee_id: employeeId } })).data.data
}

export async function createLeave(data) {
  if (isSupabase()) {
    const row = {
      employee_id: data.employee_id, type: data.type || 'annual',
      start_date: data.start_date, end_date: data.end_date, reason: data.reason, status: 'pending',
    }
    const { data: created, error } = await supabase.from('leave_requests').insert(row).select().single()
    if (error) throw new Error(error.message)
    return created
  }
  return (await apiClient.post('', { action: 'hr.createLeave', payload: data })).data.data
}

export async function updateLeaveStatus(id, status) {
  if (isSupabase()) {
    const { data: session } = await supabase.auth.getSession()
    const { data: updated, error } = await supabase.from('leave_requests')
      .update({ status, approved_by: session?.session?.user?.id, updated_at: new Date().toISOString() })
      .eq('id', id).select().single()
    if (error) throw new Error(error.message)
    return updated
  }
  return (await apiClient.post('', { action: 'hr.updateLeaveStatus', payload: { id, status } })).data.data
}

export async function deleteLeave(id) {
  if (isSupabase()) {
    const { error } = await supabase.from('leave_requests').delete().eq('id', id)
    if (error) throw new Error(error.message)
    return { ok: true }
  }
  return (await apiClient.post('', { action: 'hr.deleteLeave', payload: { id } })).data.data
}
