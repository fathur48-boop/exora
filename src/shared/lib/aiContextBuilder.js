// Client-side business context builder for the Supabase backend.
// Mirrors gas/ai/ContextBuilder.gs so the AI Assistant gives equivalent answers.
import { supabase } from './supabaseClient.js'

async function fetchAll(table, select = '*') {
  const { data, error } = await supabase.from(table).select(select)
  if (error) throw new Error(error.message)
  return data || []
}

export async function buildBusinessContext() {
  const [customers, leads, products, inventory, transactions, projects, employees] = await Promise.all([
    fetchAll('customers', 'id'),
    fetchAll('leads', 'stage'),
    fetchAll('products', 'id, name'),
    fetchAll('inventory', '*, products(name)'),
    fetchAll('transactions', 'type, amount'),
    fetchAll('projects', 'id, name, status, end_date'),
    fetchAll('employees', 'id, status'),
  ])

  const income  = transactions.filter(t => t.type === 'income')
  const expense = transactions.filter(t => t.type === 'expense')
  const totalIncome  = income.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)
  const totalExpense = expense.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)

  const lowStock = inventory.filter(i => {
    const qty = parseFloat(i.quantity) || 0
    const min = parseFloat(i.min_stock) || 0
    return min > 0 && qty <= min
  })

  const now = new Date()
  const activeProjects  = projects.filter(p => p.status === 'active')
  const overdueProjects = projects.filter(p => p.end_date && new Date(p.end_date) < now && p.status !== 'completed' && p.status !== 'cancelled')

  const leadsByStage = {}
  leads.forEach(l => { const s = l.stage || 'new'; leadsByStage[s] = (leadsByStage[s] || 0) + 1 })

  const lines = []
  lines.push('=== DATA BISNIS EXORA (REAL-TIME) ===')
  lines.push('')
  lines.push('RINGKASAN KEUANGAN:')
  lines.push(`- Total Income: Rp ${totalIncome.toLocaleString('id-ID')}`)
  lines.push(`- Total Expense: Rp ${totalExpense.toLocaleString('id-ID')}`)
  lines.push(`- Net Profit: Rp ${(totalIncome - totalExpense).toLocaleString('id-ID')}`)
  lines.push('')
  lines.push('CRM:')
  lines.push(`- Total Customers: ${customers.length}`)
  lines.push(`- Total Leads: ${leads.length}`)
  lines.push(`- Leads by stage: ${JSON.stringify(leadsByStage)}`)
  lines.push('')
  lines.push('INVENTORY:')
  lines.push(`- Total Produk: ${products.length}`)
  lines.push(`- Produk stok menipis: ${lowStock.length}`)
  if (lowStock.length > 0) {
    lines.push('  Detail: ' + lowStock.slice(0, 5).map(i => `${i.products?.name || i.product_id} (sisa ${i.quantity})`).join(', '))
  }
  lines.push('')
  lines.push('PROJECTS:')
  lines.push(`- Total Projects: ${projects.length}`)
  lines.push(`- Active Projects: ${activeProjects.length}`)
  lines.push(`- Overdue Projects: ${overdueProjects.length}`)
  if (overdueProjects.length > 0) {
    lines.push('  Detail: ' + overdueProjects.slice(0, 5).map(p => p.name).join(', '))
  }
  lines.push('')
  lines.push('HR:')
  lines.push(`- Total Karyawan: ${employees.length}`)
  lines.push(`- Karyawan Aktif: ${employees.filter(e => e.status === 'active').length}`)
  lines.push('')
  lines.push('=== AKHIR DATA BISNIS ===')

  return lines.join('\n')
}
