export const INCOME_CATEGORIES  = ['Sales','Service','Investment','Refund','Other']
export const EXPENSE_CATEGORIES = ['Operational','Salary','Marketing','Inventory','Tax','Utility','Rent','Other']
export const PAYMENT_METHODS    = ['cash','transfer','card','other']
export const TRANSACTION_TYPES  = ['income','expense']
export const TRANSACTION_STATUSES = ['paid','unpaid','partial']
export const TYPE_CONFIG = {
  income:  { label:'Income',  color:'bg-green-100 text-green-700', dot:'bg-green-500'  },
  expense: { label:'Expense', color:'bg-red-100 text-red-700',     dot:'bg-red-500'    },
}
export const STATUS_CONFIG = {
  paid:    { label:'Paid',    color:'bg-green-100 text-green-700' },
  unpaid:  { label:'Unpaid',  color:'bg-red-100 text-red-700'     },
  partial: { label:'Partial', color:'bg-amber-100 text-amber-700' },
}
export const PAYMENT_LABELS = { cash:'Cash', transfer:'Transfer', card:'Card', other:'Other' }
export function getCategoriesByType(type) { return type==='income'?INCOME_CATEGORIES:EXPENSE_CATEGORIES }
export function filterTransactions(transactions,{search,type,status,dateFrom,dateTo}) {
  return transactions.filter(t=>{
    const m = !search||t.description?.toLowerCase().includes(search.toLowerCase())||t.contact_name?.toLowerCase().includes(search.toLowerCase())||t.reference?.toLowerCase().includes(search.toLowerCase())
    return m&&(!type||t.type===type)&&(!status||t.status===status)&&(!dateFrom||new Date(t.date)>=new Date(dateFrom))&&(!dateTo||new Date(t.date)<=new Date(dateTo))
  })
}
export function formatDate(iso) {
  if(!iso)return '—'
  return new Date(iso).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})
}
