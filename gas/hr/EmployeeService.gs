var EmployeeService = (function () {
  var SHEET = CONFIG.SHEETS.EMPLOYEES
  var STATUSES = ['active','inactive','on_leave']

  function getAll() {
    return SheetService.getAll(SHEET).sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at)})
  }
  function getById(id) {
    var e = SheetService.findById(SHEET, id)
    if (!e) throw new Error('Employee not found')
    return e
  }
  function create(data) {
    var now = new Date().toISOString()
    var e = {
      id: Utilities.getUuid(), full_name: data.full_name||'', email: data.email||'', phone: data.phone||'',
      role: data.role||'', department: data.department||'', status: data.status||'active',
      salary: parseFloat(data.salary)||0, join_date: data.join_date||now.slice(0,10),
      birth_date: data.birth_date||'', address: data.address||'', emergency_contact: data.emergency_contact||'',
      notes: data.notes||'', created_at: now, updated_at: now,
    }
    if (!e.full_name.trim()) throw new Error('Full name is required')
    if (STATUSES.indexOf(e.status)===-1) throw new Error('Invalid status')
    if (e.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)) throw new Error('Invalid email')
    SheetService.insert(SHEET, e)
    return e
  }
  function update(id, data) {
    var ex = getById(id)
    var now = new Date().toISOString()
    var partial = {
      full_name: data.full_name!==undefined?data.full_name:ex.full_name,
      email: data.email!==undefined?data.email:ex.email,
      phone: data.phone!==undefined?data.phone:ex.phone,
      role: data.role!==undefined?data.role:ex.role,
      department: data.department!==undefined?data.department:ex.department,
      status: data.status!==undefined?data.status:ex.status,
      salary: data.salary!==undefined?parseFloat(data.salary)||0:ex.salary,
      join_date: data.join_date!==undefined?data.join_date:ex.join_date,
      birth_date: data.birth_date!==undefined?data.birth_date:ex.birth_date,
      address: data.address!==undefined?data.address:ex.address,
      emergency_contact: data.emergency_contact!==undefined?data.emergency_contact:ex.emergency_contact,
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
  function getSummary() {
    var all = getAll()
    var byStatus = {}
    STATUSES.forEach(function(s){byStatus[s]=0})
    all.forEach(function(e){if(byStatus[e.status]!==undefined)byStatus[e.status]++})
    var totalSalary = all.filter(function(e){return e.status==='active'}).reduce(function(s,e){return s+(parseFloat(e.salary)||0)},0)
    var byDept = {}
    all.forEach(function(e){if(e.department)byDept[e.department]=(byDept[e.department]||0)+1})
    return { total: all.length, by_status: byStatus, total_salary: totalSalary, by_department: byDept }
  }
  return { getAll, getById, create, update, remove, getSummary }
})()
