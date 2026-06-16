var CustomerService = (function () {
  var SHEET = CONFIG.SHEETS.CUSTOMERS
  var STATUSES = ['active','inactive']

  function getAll() {
    return SheetService.getAll(SHEET).sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at)})
  }
  function getById(id) {
    var c = SheetService.findById(SHEET, id)
    if (!c) throw new Error('Customer not found')
    return c
  }
  function create(data) {
    var now = new Date().toISOString()
    var c = {
      id: Utilities.getUuid(), name: data.name||'', email: data.email||'', phone: data.phone||'',
      company: data.company||'', address: data.address||'', status: data.status||'active',
      notes: data.notes||'', created_at: now, updated_at: now,
    }
    if (!c.name.trim()) throw new Error('Nama wajib diisi')
    if (STATUSES.indexOf(c.status)===-1) throw new Error('Status tidak valid')
    SheetService.insert(SHEET, c)
    return c
  }
  function update(id, data) {
    var ex = getById(id)
    var now = new Date().toISOString()
    var partial = {
      name: data.name!==undefined?data.name:ex.name,
      email: data.email!==undefined?data.email:ex.email,
      phone: data.phone!==undefined?data.phone:ex.phone,
      company: data.company!==undefined?data.company:ex.company,
      address: data.address!==undefined?data.address:ex.address,
      status: data.status!==undefined?data.status:ex.status,
      notes: data.notes!==undefined?data.notes:ex.notes,
      updated_at: now,
    }
    SheetService.updateById(SHEET, id, partial)
    return Object.assign({}, ex, partial)
  }
  function remove(id) {
    getById(id)
    SheetService.deleteById(SHEET, id)
    return { ok: true }
  }
  return { getAll, getById, create, update, remove }
})()
