var LeaveService = (function () {
  var SHEET = CONFIG.SHEETS.LEAVE_REQUESTS
  var TYPES = ['annual','sick','personal','unpaid']
  var STATUSES = ['pending','approved','rejected']

  function getAll() {
    var all = SheetService.getAll(SHEET)
    var employees = SheetService.getAll(CONFIG.SHEETS.EMPLOYEES)
    return all.map(function(l){
      var emp = employees.find(function(e){return e.id===l.employee_id}) || {}
      return Object.assign({}, l, { employee_name: emp.full_name||'', employee_department: emp.department||'' })
    }).sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at)})
  }
  function getByEmployee(employeeId) {
    return SheetService.getAll(SHEET)
      .filter(function(l){return l.employee_id===employeeId})
      .sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at)})
  }
  function create(data) {
    var now = new Date().toISOString()
    var l = {
      id: Utilities.getUuid(), employee_id: data.employee_id||'', type: data.type||'annual',
      start_date: data.start_date||'', end_date: data.end_date||'', reason: data.reason||'',
      status: 'pending', approved_by: '', created_at: now, updated_at: now,
    }
    if (!l.employee_id) throw new Error('employee_id is required')
    if (TYPES.indexOf(l.type)===-1) throw new Error('Invalid leave type')
    if (!l.start_date || !l.end_date) throw new Error('Start and end date are required')
    if (new Date(l.end_date) < new Date(l.start_date)) throw new Error('End date must be after start date')
    if (!l.reason.trim()) throw new Error('Reason is required')
    SheetService.insert(SHEET, l)
    return l
  }
  function updateStatus(id, status, approvedBy) {
    var l = SheetService.findById(SHEET, id)
    if (!l) throw new Error('Leave request not found')
    if (STATUSES.indexOf(status)===-1) throw new Error('Invalid status')
    var partial = { status: status, approved_by: approvedBy||'', updated_at: new Date().toISOString() }
    SheetService.updateById(SHEET, id, partial)
    return Object.assign({}, l, partial)
  }
  function remove(id) {
    var l = SheetService.findById(SHEET, id)
    if (!l) throw new Error('Leave request not found')
    SheetService.deleteById(SHEET, id)
    return { ok: true }
  }
  return { getAll, getByEmployee, create, updateStatus, remove }
})()
