import { useState }               from 'react'
import { useParams,useNavigate }  from 'react-router-dom'
import { ArrowLeft,Edit2 }        from 'lucide-react'
import Topbar         from '../../../shared/components/ui/Topbar.jsx'
import Button         from '../../../shared/components/ui/Button.jsx'
import Spinner        from '../../../shared/components/ui/Spinner.jsx'
import Card, { CardBody,CardHeader } from '../../../shared/components/ui/Card.jsx'
import { TypeBadge,StatusBadge } from '../components/shared/TypeBadge.jsx'
import TransactionForm from '../components/transactions/TransactionForm.jsx'
import { useTransactionDetail } from '../hooks/useTransactionDetail.js'
import { useTransactions }      from '../hooks/useTransactions.js'
import { formatCurrency }       from '../../dashboard/utils/dashboardHelpers.js'
import { formatDate,PAYMENT_LABELS } from '../utils/financeHelpers.js'
import { cn } from '../../../shared/utils/cn.js'
export default function TransactionDetailPage() {
  const { id } = useParams(); const navigate = useNavigate()
  const { transaction,isLoading } = useTransactionDetail(id)
  const { update,saving }         = useTransactions()
  const [editing,setEditing]      = useState(false)
  if(isLoading)return <div className="flex items-center justify-center min-h-full"><Spinner size="lg" className="text-brand-400"/></div>
  if(!transaction)return null
  const isIncome = transaction.type==='income'
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title="Detail Transaksi" subtitle={transaction.description}/>
      <div className="flex-1 p-6 flex flex-col gap-6 max-w-3xl">
        <button onClick={()=>navigate('/finance')} className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand-600 transition-colors w-fit font-medium"><ArrowLeft className="w-3.5 h-3.5"/> Kembali ke Finance</button>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold',isIncome?'bg-green-100 text-green-700':'bg-red-100 text-red-700')}>{isIncome?'↑':'↓'}</div>
              <div><p className="text-sm font-bold text-ink">{transaction.description}</p><p className="text-xs text-ink-muted">{formatDate(transaction.date)}</p></div>
            </div>
            <Button variant="ghost" size="sm" leftIcon={<Edit2 className="w-3.5 h-3.5"/>} onClick={()=>setEditing(true)}>Edit</Button>
          </CardHeader>
          <CardBody>
            {editing ? <TransactionForm initial={transaction} onSubmit={async d=>{await update(id,d);setEditing(false)}} onCancel={()=>setEditing(false)} saving={saving}/>
            : <div className="flex flex-col gap-5">
                <div className="text-center py-4 border-b border-surface-border">
                  <p className={cn('text-4xl font-extrabold tracking-tight',isIncome?'text-green-600':'text-red-600')}>{isIncome?'+':'-'}{formatCurrency(transaction.amount)}</p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[['Tipe',<TypeBadge key="t" type={transaction.type}/>],['Status',<StatusBadge key="s" status={transaction.status}/>],['Kategori',transaction.category||'—'],['Metode',PAYMENT_LABELS[transaction.payment_method]??'—'],['Referensi',transaction.reference||'—'],['Kontak',transaction.contact_name||'—']].map(([label,value])=>(
                    <div key={label}><p className="text-2xs text-ink-faint mb-0.5 font-medium uppercase tracking-wide">{label}</p><div className="text-sm font-semibold text-ink">{value}</div></div>
                  ))}
                </div>
                {transaction.notes&&<div><p className="text-2xs text-ink-faint mb-0.5 font-medium uppercase tracking-wide">Catatan</p><p className="text-sm text-ink">{transaction.notes}</p></div>}
              </div>}
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
