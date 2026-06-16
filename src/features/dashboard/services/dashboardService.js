import apiClient from '../../../shared/lib/axios.js'
import { supabase } from '../../../shared/lib/supabaseClient.js'
import { isSupabase } from '../../../shared/lib/crudAdapter.js'

export async function fetchDashboardSummary() {
  if (isSupabase()) {
    const [customers, leads, products, transactions, projects, employees] = await Promise.all([
      supabase.from('customers').select('id'),
      supabase.from('leads').select('id, stage'),
      supabase.from('products').select('id'),
      supabase.from('transactions').select('type, amount, date, status'),
      supabase.from('projects').select('id, status'),
      supabase.from('employees').select('id, status'),
    ])
    const err = [customers, leads, products, transactions, projects, employees].find(r => r.error)
    if (err) throw new Error(err.error.message)

    const txns = transactions.data || []
    const income = txns.filter(t => t.type === 'income' && t.status !== 'unpaid')
    const totalRevenue = income.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const recentRevenue = income.filter(t => new Date(t.date) >= monthStart)
      .reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)

    const leadsData = leads.data || []
    const activeLeads = leadsData.filter(l => l.stage !== 'closed' && l.stage !== 'lost').length

    const projectsData = projects.data || []
    const activeProjects = projectsData.filter(p => p.status === 'active').length

    const stats = {
      total_customers: (customers.data || []).length,
      total_revenue: totalRevenue,
      recent_revenue: recentRevenue,
      active_leads: activeLeads,
      total_leads: leadsData.length,
      total_products: (products.data || []).length,
      active_projects: activeProjects,
      total_projects: projectsData.length,
      total_employees: (employees.data || []).filter(e => e.status === 'active').length,
    }

    // Revenue trend - last 7 days
    const revenueTrend = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i)
      const dayStr = d.toISOString().slice(0, 10)
      const dayTotal = income.filter(t => (t.date || '').slice(0, 10) === dayStr)
        .reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)
      revenueTrend.push({ label: d.toLocaleDateString('id-ID', { weekday: 'short' }), value: dayTotal })
    }

    // Leads pipeline by stage
    const stageLabels = { new:'New', contacted:'Contacted', qualified:'Qualified', proposal:'Proposal', negotiation:'Negotiation', closed:'Closed', lost:'Lost' }
    const stageCounts = {}
    Object.keys(stageLabels).forEach(s => stageCounts[s] = 0)
    leadsData.forEach(l => { const s = (l.stage || 'new').toLowerCase(); if (stageCounts[s] !== undefined) stageCounts[s]++ })
    const leadsPipeline = Object.keys(stageLabels).map(s => ({ label: stageLabels[s], value: stageCounts[s] }))

    return { stats, revenue_trend: revenueTrend, leads_pipeline: leadsPipeline }
  }
  const r = await apiClient.post('', { action: 'dashboard.getSummary', payload: {} })
  return r.data.data
}
