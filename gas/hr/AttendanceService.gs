var AttendanceService = (function () {
  var SHEET = CONFIG.SHEETS.ATTENDANCE
  var STATUSES = ['present','absent','late','leave','holiday']

  function getByEmployee(employeeId) {
    return SheetService.getAll(SHEET)
      .filter(function(a){return a.employee_id===employeeId})
      .sort(function(a,b){return new Date(b.date)-new Date(a.date)})
  }
  function getByDate(date) {
    var all = SheetService.getAll(SHEET)
    var employees = SheetService.getAll(CONFIG.SHEETS.EMPLOYEES)
    return all.filter(function(a){return a.date===date}).map(function(a){
      var emp = employees.find(function(e){return e.id===a.employee_id}) || {}
      return Object.assign({}, a, { employee_name: emp.full_name||'', employee_department: emp.department||'', employee_role: emp.role||'' })
    })
  }
  function getMonthly(employeeId, year, month) {
    return SheetService.getAll(SHEET).filter(function(a){
      if (a.employee_id!==employeeId) return false
      var d = new Date(a.date)
      return d.getFullYear()===year && (d.getMonth()+1)===month
    }).sort(function(a,b){return new Date(a.date)-new Date(b.date)})
  }
  function record(data) {
    var existing = SheetService.getAll(SHEET).find(function(a){return a.employee_id===data.employee_id && a.date===data.date})
    var now = new Date().toISOString()
    if (existing) {
      var partial = {
        status: data.status||existing.status,
        check_in: data.check_in!==undefined?data.check_in:existing.check_in,
        check_out: data.check_out!==undefined?data.check_out:existing.check_out,
        notes: data.notes!==undefined?data.notes:existing.notes,
      }
      SheetService.updateById(SHEET, existing.id, partial)
      return Object.assign({}, existing, partial)
    }
    var rec = {
      id: Utilities.getUuid(), employee_id: data.employee_id||'', date: data.date||now.slice(0,10),
      status: data.status||'present', check_in: data.check_in||'', check_out: data.check_out||'',
      notes: data.notes||'', created_at: now,
    }
    if (!rec.employee_id) throw new Error('employee_id is required')
    if (!rec.date) throw new Error('date is required')
    if (STATUSES.indexOf(rec.status)===-1) throw new Error('Invalid attendance status')
    SheetService.insert(SHEET, rec)
    return rec
  }
  function getMonthlySummary(employeeId, year, month) {
    var records = getMonthly(employeeId, year, month)
    var summary = { present:0, absent:0, late:0, leave:0, holiday:0 }
    records.forEach(function(r){if(summary[r.status]!==undefined)summary[r.status]++})
    return { employee_id: employeeId, year: year, month: month, summary: summary, records: records }
  }
  return { getByEmployee, getByDate, getMonthly, record, getMonthlySummary }
})()
