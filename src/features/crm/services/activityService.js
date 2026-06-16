import { createCrudAdapter } from '../../../shared/lib/crudAdapter.js'

const adapter = createCrudAdapter({
  table: 'activities',
  gas: {
    getAll: 'crm.getActivities',
    create: 'crm.createActivity',
    remove: 'crm.deleteActivity',
  },
  order: { column: 'created_at', ascending: false },
})

export const fetchActivities = (entityType, entityId) =>
  adapter.getAll({ entity_type: entityType, entity_id: entityId })

export const createActivity  = (data) => adapter.create(data)
export const deleteActivity  = (id)   => adapter.remove(id)
