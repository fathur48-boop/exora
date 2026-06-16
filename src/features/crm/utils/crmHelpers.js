export const CUSTOMER_STATUSES = ['active','inactive']
export const LEAD_STAGES  = ['new','contacted','qualified','proposal','negotiation','closed','lost']
export const LEAD_SOURCES = ['website','referral','social','cold_call','other']
export const ACTIVITY_TYPES = ['note','call','email','meeting']

export const STAGE_COLORS = {
  new:'bg-slate-100 text-slate-700', contacted:'bg-blue-100 text-blue-700',
  qualified:'bg-amber-100 text-amber-700', proposal:'bg-purple-100 text-purple-700',
  negotiation:'bg-orange-100 text-orange-700', closed:'bg-green-100 text-green-700', lost:'bg-red-100 text-red-700',
}
export const STATUS_COLORS = { active:'bg-green-100 text-green-700', inactive:'bg-gray-100 text-gray-600' }

export function formatStageLabel(stage) {
  return stage ? stage.charAt(0).toUpperCase()+stage.slice(1).replace('_',' ') : ''
}
export function formatSourceLabel(source) {
  return { website:'Website', referral:'Referral', social:'Social Media', cold_call:'Cold Call', other:'Other' }[source] ?? source
}
export function filterCustomers(customers, search, status) {
  return customers.filter(c => {
    const m = !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase()) || c.company?.toLowerCase().includes(search.toLowerCase())
    return m && (!status || c.status === status)
  })
}
export function filterLeads(leads, search, stage) {
  return leads.filter(l => {
    const m = !search || l.name?.toLowerCase().includes(search.toLowerCase()) || l.email?.toLowerCase().includes(search.toLowerCase()) || l.company?.toLowerCase().includes(search.toLowerCase())
    return m && (!stage || l.stage === stage)
  })
}
