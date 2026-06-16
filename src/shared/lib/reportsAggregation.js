// Client-side report aggregation for the Supabase backend.
// Mirrors gas/reports/ReportsService.gs so both backends return the same shape.
import { supabase } from './supabaseClient.js'

async function fetchAll(table, select = '*') {
  const { data, error } = await supabase.from(table).select(select).limit(10000)
  if (error) throw new Error(error.message)
  return data || []
}

export async function getRevenueReport() {
  const transactions = await fetchAll('transactions')
  const now = new Date(), year = now.getFullYear(), month = now.getMonth()
  const income  = transactions.filter(t => t.type === 'income'  && t.status !== 'unpaid')
  const expense = transactions.filter(t => t.type === 'expense' && t.status !== 'unpaid')
  const sum = (arr) => arr.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)

  const totalIncome  = sum(income)
  const totalExpense = sum(expense)
  const monthIncome  = sum(income.filter(t  => { const d = new Date(t.date); return d.getFullYear() === year && d.getMonth() === month }))
  const monthExpense = sum(expense.filter(t => { const d = new Date(t.date); return d.getFullYear() === year && d.getMonth() === month }))

  const byCategory = {}
  income.forEach(t => { const cat = t.category || 'Other'; byCategory[cat] = (byCategory[cat] || 0) + (parseFloat(t.amount) || 0) })

  const monthly = []
  for (let i = 11; i >= 0; i--) {
    const d = new Date(year, month - i, 1)
    const y = d.getFullYear(), m = d.getMonth()
    const label = d.toLocaleString('id-ID', { month: 'short', year: '2-digit' })
    const inc = sum(income.filter(t  => { const td = new Date(t.date); return td.getFullYear() === y && td.getMonth() === m }))
    const exp = sum(expense.filter(t => { const td = new Date(t.date); return td.getFullYear() === y && td.getMonth() === m }))
    monthly.push({ label, income: inc, expense: exp, profit: inc - exp })
  }

  return {
    total_income: totalIncome, total_expense: totalExpense, net_profit: totalIncome - totalExpense,
    month_income: monthIncome, month_expense: monthExpense, month_profit: monthIncome - monthExpense,
    profit_margin: totalIncome > 0 ? Math.round(((totalIncome - totalExpense) / totalIncome) * 100) : 0,
    by_category: byCategory, monthly_trend: monthly,
  }
}

export async function getLeadsReport() {
  const leads = await fetchAll('leads')
  const stages  = ['new','contacted','qualified','proposal','negotiation','closed','lost']
  const sources = ['website','referral','social','cold_call','other']
  const byStage = {}, bySource = {}
  stages.forEach(s => byStage[s] = 0)
  sources.forEach(s => bySource[s] = 0)
  let totalValue = 0, closedValue = 0
  leads.forEach(l => {
    const s = (l.stage || 'new').toLowerCase()
    const r = (l.source || 'other').toLowerCase()
    if (byStage[s] !== undefined) byStage[s]++
    if (bySource[r] !== undefined) bySource[r]++
    totalValue += parseFloat(l.value) || 0
    if (s === 'closed') closedValue += parseFloat(l.value) || 0
  })
  const conversionRate = leads.length > 0 ? Math.round((byStage['closed'] / leads.length) * 100) : 0
  return { total: leads.length, by_stage: byStage, by_source: bySource, total_value: totalValue, closed_value: closedValue, conversion_rate: conversionRate }
}

export async function getInventoryReport() {
  const inventory = await fetchAll('inventory', '*, products(price, category)')
  let totalValue = 0, lowStock = 0, outOfStock = 0
  const byCategory = {}
  inventory.forEach(inv => {
    const product = inv.products || {}
    const qty = parseFloat(inv.quantity) || 0
    const minQty = parseFloat(inv.min_stock) || 0
    const price = parseFloat(product.price) || 0
    const cat = product.category || 'Uncategorized'
    totalValue += qty * price
    if (qty === 0) outOfStock++
    else if (qty <= minQty && minQty > 0) lowStock++
    byCategory[cat] = (byCategory[cat] || 0) + qty
  })
  const products = await fetchAll('products', 'id')
  return { total_products: products.length, total_value: totalValue, low_stock: lowStock, out_of_stock: outOfStock, by_category: byCategory }
}

export async function getHrReport() {
  const employees = await fetchAll('employees')
  const active = employees.filter(e => e.status === 'active')
  const byDept = {}
  employees.forEach(e => { const d = e.department || 'Uncategorized'; byDept[d] = (byDept[d] || 0) + 1 })
  const totalSalary = active.reduce((s, e) => s + (parseFloat(e.salary) || 0), 0)
  const avgSalary = active.length ? Math.round(totalSalary / active.length) : 0
  return { total: employees.length, active: active.length, total_salary: totalSalary, avg_salary: avgSalary, by_department: byDept }
}

export async function getProjectsReport() {
  const projects = await fetchAll('projects')
  const byStatus = {}
  let totalBudget = 0, totalSpent = 0, overdue = 0
  const now = new Date()
  projects.forEach(p => {
    const s = p.status || 'planning'
    byStatus[s] = (byStatus[s] || 0) + 1
    totalBudget += parseFloat(p.budget) || 0
    totalSpent  += parseFloat(p.spent) || 0
    if (p.end_date && new Date(p.end_date) < now && s !== 'completed' && s !== 'cancelled') overdue++
  })
  return {
    total: projects.length, by_status: byStatus, total_budget: totalBudget, total_spent: totalSpent,
    budget_usage: totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0, overdue,
  }
}

export async function getFullReport() {
  const [revenue, leads, inventory, hr, projects] = await Promise.all([
    getRevenueReport(), getLeadsReport(), getInventoryReport(), getHrReport(), getProjectsReport(),
  ])
  return { revenue, leads, inventory, hr, projects, generated_at: new Date().toISOString() }
}
