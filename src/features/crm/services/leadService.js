import { createCrudAdapter } from '../../../shared/lib/crudAdapter.js'

const adapter = createCrudAdapter({
  table: 'leads',
  gas: {
    getAll: 'crm.getLeads',
    getById: 'crm.getLead',
    create: 'crm.createLead',
    update: 'crm.updateLead',
    remove: 'crm.deleteLead',
  },
  order: { column: 'created_at', ascending: false },
})

export const fetchLeads      = () => adapter.getAll()
export const fetchLeadById   = (id) => adapter.getById(id)
export const createLead      = (data) => adapter.create(data)
export const updateLead      = (id, data) => adapter.update(id, data)
export const updateLeadStage = (id, stage) => adapter.update(id, { stage })
export const deleteLead      = (id) => adapter.remove(id)
export const bulkCreateLeads = (rows) => adapter.bulkCreate(rows)
