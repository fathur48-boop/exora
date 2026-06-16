import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Edit2 } from 'lucide-react'
import Topbar         from '../../../shared/components/ui/Topbar.jsx'
import Button         from '../../../shared/components/ui/Button.jsx'
import Spinner        from '../../../shared/components/ui/Spinner.jsx'
import Card, { CardBody, CardHeader } from '../../../shared/components/ui/Card.jsx'
import LeadStageBadge from '../components/leads/LeadStageBadge.jsx'
import LeadForm       from '../components/leads/LeadForm.jsx'
import ActivityFeed   from '../components/activities/ActivityFeed.jsx'
import ActivityForm   from '../components/activities/ActivityForm.jsx'
import { useLeadDetail } from '../hooks/useLeadDetail.js'
import { useLeads }      from '../hooks/useLeads.js'
import { useActivities } from '../hooks/useActivities.js'
import { formatCurrency } from '../../dashboard/utils/dashboardHelpers.js'
import { formatSourceLabel } from '../utils/crmHelpers.js'

export default function LeadDetailPage() {
  const { id } = useParams(); const navigate = useNavigate()
  const { lead, isLoading }   = useLeadDetail(id)
  const { update, saving }    = useLeads()
  const { activities, isLoading:actLoading, saving:actSaving, create:logActivity, remove:removeActivity } = useActivities('lead', id)
  const [editing,setEditing]  = useState(false)
  if (isLoading) return <div className="flex items-center justify-center min-h-full"><Spinner size="lg" className="text-brand-400"/></div>
  if (!lead) return null
  return (
    <div className="flex flex-col min-h-full">
      <Topbar title={lead.name} subtitle="Detail lead"/>
      <div className="flex-1 p-6 flex flex-col gap-6 max-w-4xl">
        <button onClick={()=>navigate('/crm/leads')} className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand-600 transition-colors w-fit font-medium">
          <ArrowLeft className="w-3.5 h-3.5"/> Kembali ke Leads
        </button>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div>
                  <p className="text-sm font-bold text-ink">{lead.name}</p>
                  {lead.company&&<p className="text-xs text-ink-muted">{lead.company}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <LeadStageBadge stage={lead.stage}/>
                  <Button variant="ghost" size="sm" leftIcon={<Edit2 className="w-3.5 h-3.5"/>} onClick={()=>setEditing(true)}>Edit</Button>
                </div>
              </CardHeader>
              <CardBody>
                {editing ? <LeadForm initial={lead} onSubmit={async d=>{await update(id,d);setEditing(false)}} onCancel={()=>setEditing(false)} saving={saving}/>
                : <div className="grid grid-cols-2 gap-4">
                    {[['Email',lead.email||'—'],['Telepon',lead.phone||'—'],['Source',formatSourceLabel(lead.source)],['Value',lead.value?formatCurrency(lead.value):'—']].map(([label,value])=>(
                      <div key={label}><p className="text-2xs text-ink-faint mb-0.5 font-medium uppercase tracking-wide">{label}</p><p className="text-sm text-ink font-medium">{value}</p></div>
                    ))}
                    {lead.notes&&<div className="col-span-2"><p className="text-2xs text-ink-faint mb-0.5 font-medium uppercase tracking-wide">Catatan</p><p className="text-sm text-ink">{lead.notes}</p></div>}
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
