import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2 } from 'lucide-react'
import Topbar              from '../../../shared/components/ui/Topbar.jsx'
import Button              from '../../../shared/components/ui/Button.jsx'
import Spinner             from '../../../shared/components/ui/Spinner.jsx'
import Card, { CardBody, CardHeader } from '../../../shared/components/ui/Card.jsx'
import CustomerStatusBadge from '../components/customers/CustomerStatusBadge.jsx'
import CustomerForm        from '../components/customers/CustomerForm.jsx'
import ActivityFeed        from '../components/activities/ActivityFeed.jsx'
import ActivityForm        from '../components/activities/ActivityForm.jsx'
import { useCustomerDetail } from '../hooks/useCustomerDetail.js'
import { useCustomers }      from '../hooks/useCustomers.js'
import { useActivities }     from '../hooks/useActivities.js'

export default function CustomerDetailPage() {
  const { id } = useParams(); const navigate = useNavigate()
  const { customer, isLoading } = useCustomerDetail(id)
  const { update, saving }      = useCustomers()
  const { activities, isLoading: actLoading, saving: actSaving, create: logActivity, remove: removeActivity } = useActivities('customer', id)
  const [editing, setEditing] = useState(false)
  if (isLoading) return <div className="flex items-center justify-center min-h-full"><Spinner size="lg" className="text-brand-400"/></div>
  if (!customer) return null
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title={customer.name} subtitle="Detail customer"/>
      <div className="flex-1 p-6 flex flex-col gap-6 max-w-4xl">
        <button onClick={()=>navigate('/crm/customers')} className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand-600 transition-colors w-fit font-medium">
          <ArrowLeft className="w-3.5 h-3.5"/> Kembali ke Customers
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center text-brand-700 font-bold text-sm">
                    {customer.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div><p className="text-sm font-bold text-ink">{customer.name}</p>
                    {customer.company&&<p className="text-xs text-ink-muted">{customer.company}</p>}</div>
                </div>
                <Button variant="ghost" size="sm" leftIcon={<Edit2 className="w-3.5 h-3.5"/>} onClick={()=>setEditing(true)}>Edit</Button>
              </CardHeader>
              <CardBody>
                {editing ? <CustomerForm initial={customer} onSubmit={async d=>{await update(id,d);setEditing(false)}} onCancel={()=>setEditing(false)} saving={saving}/>
                : <div className="grid grid-cols-2 gap-4">
                    {[['Email',customer.email||'—'],['Telepon',customer.phone||'—'],['Alamat',customer.address||'—'],['Status',<CustomerStatusBadge key="s" status={customer.status}/>]].map(([label,value])=>(
                      <div key={label}><p className="text-2xs text-ink-faint mb-0.5 font-medium uppercase tracking-wide">{label}</p><div className="text-sm text-ink font-medium">{value}</div></div>
                    ))}
                    {customer.notes&&<div className="col-span-2"><p className="text-2xs text-ink-faint mb-0.5 font-medium uppercase tracking-wide">Catatan</p><p className="text-sm text-ink">{customer.notes}</p></div>}
                  </div>}
              </CardBody>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader><p className="text-xs font-bold text-ink uppercase tracking-wide">Aktivitas</p></CardHeader>
              <CardBody className="flex flex-col gap-4">
                <ActivityForm onSubmit={logActivity} saving={actSaving}/>
                <ActivityFeed activities={activities} isLoading={actLoading} onDelete={removeActivity}/>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
