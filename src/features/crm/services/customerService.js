import { createCrudAdapter } from '../../../shared/lib/crudAdapter.js'

const adapter = createCrudAdapter({
  table: 'customers',
  gas: {
    getAll: 'crm.getCustomers',
    getById: 'crm.getCustomer',
    create: 'crm.createCustomer',
    update: 'crm.updateCustomer',
    remove: 'crm.deleteCustomer',
  },
  order: { column: 'created_at', ascending: false },
})

export const fetchCustomers      = () => adapter.getAll()
export const fetchCustomerById   = (id) => adapter.getById(id)
export const createCustomer      = (data) => adapter.create(data)
export const updateCustomer      = (id, data) => adapter.update(id, data)
export const deleteCustomer      = (id) => adapter.remove(id)
export const bulkCreateCustomers = (rows) => adapter.bulkCreate(rows)
