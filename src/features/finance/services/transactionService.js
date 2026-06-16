import apiClient from '../../../shared/lib/axios.js'
import { supabase } from '../../../shared/lib/supabaseClient.js'
import { createCrudAdapter, isSupabase } from '../../../shared/lib/crudAdapter.js'

const adapter = createCrudAdapter({
  table: 'transactions',
  gas: {
    getAll: 'finance.getTransactions',
    getById: 'finance.getTransaction',
    create: 'finance.createTransaction',
    update: 'finance.updateTransaction',
    remove: 'finance.deleteTransaction',
  },
  order: { column: 'date', ascending: false },
})

export const fetchTransactions      = () => adapter.getAll()
export const fetchTransactionById   = (id) => adapter.getById(id)
export const createTransaction      = (data) => adapter.create({ ...data, amount: Number(data.amount) || 0 })
export const updateTransaction      = (id, data) => adapter.update(id, { ...data, amount: data.amount !== undefined ? Number(data.amount) || 0 : undefined })
export const deleteTransaction      = (id) => adapter.remove(id)
export const bulkCreateTransactions = (rows) => adapter.bulkCreate(rows.map(r => ({ ...r, amount: Number(r.amount) || 0 })))

export async function fetchFinanceSummary() {
  if (isSupabase()) {
    const { data: all, error } = await supabase.from('transactions').select('*').limit(10000)
    if (error) throw new Error(error.message)

    const income  = all.filter(t => t.type === 'income')
    const expense = all.filter(t => t.type === 'expense')
    const sum = (arr) => arr.reduce((s, t) => s + (parseFloat(t.amount) || 0), 0)

    const totalIncome  = sum(income.filter(t => t.status !== 'unpaid'))
    const totalExpense = sum(expense.filter(t => t.status !== 'unpaid'))

    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    const inMonth = (t) => new Date(t.date) >= monthStart
    const monthIncome  = sum(income.filter(t => t.status !== 'unpaid' && inMonth(t)))
    const monthExpense = sum(expense.filter(t => t.status !== 'unpaid' && inMonth(t)))

    const unpaidIncome  = sum(income.filter(t => t.status === 'unpaid'))
    const unpaidExpense = sum(expense.filter(t => t.status === 'unpaid'))

    const trend = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const y = d.getFullYear(), m = d.getMonth()
      const label = d.toLocaleString('id-ID', { month: 'short', year: '2-digit' })
      const inc = sum(income.filter(t => { const td = new Date(t.date); return td.getFullYear() === y && td.getMonth() === m && t.status !== 'unpaid' }))
      const exp = sum(expense.filter(t => { const td = new Date(t.date); return td.getFullYear() === y && td.getMonth() === m && t.status !== 'unpaid' }))
      trend.push({ label, income: inc, expense: exp })
    }

    return {
      total_income: totalIncome, total_expense: totalExpense, net_profit: totalIncome - totalExpense,
      month_income: monthIncome, month_expense: monthExpense, month_profit: monthIncome - monthExpense,
      unpaid_income: unpaidIncome, unpaid_expense: unpaidExpense, trend,
    }
  }
  return (await apiClient.post('', { action: 'finance.getSummary', payload: {} })).data.data
}
