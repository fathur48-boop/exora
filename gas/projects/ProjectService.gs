var ProjectService = (function () {
  var SHEET = CONFIG.SHEETS.PROJECTS
  var STATUSES = ['planning','active','on_hold','completed','cancelled']
  var PRIORITIES = ['low','medium','high','critical']

  function getAll() {
    return SheetService.getAll(SHEET).sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at)})
  }
  function getById(id) {
    var p = SheetService.findById(SHEET, id)
    if (!p) throw new Error('Project not found')
    return p
  }
  function create(data, userId) {
    var now = new Date().toISOString()
    var p = {
      id: Utilities.getUuid(), name: data.name||'', description: data.description||'',
      status: data.status||'planning', priority: data.priority||'medium',
      client_name: data.client_name||'', client_id: data.client_id||'',
      budget: parseFloat(data.budget)||0, spent: parseFloat(data.spent)||0,
      start_date: data.start_date||now.slice(0,10), end_date: data.end_date||'',
      created_by: userId||'', created_at: now, updated_at: now,
    }
    if (!p.name.trim()) throw new Error('Project name is required')
    if (STATUSES.indexOf(p.status)===-1) throw new Error('Invalid status')
    if (PRIORITIES.indexOf(p.priority)===-1) throw new Error('Invalid priority')
    SheetService.insert(SHEET, p)
    return p
  }
  function update(id, data) {
    var ex = getById(id)
    var now = new Date().toISOString()
    var partial = {
      name: data.name!==undefined?data.name:ex.name,
      description: data.description!==undefined?data.description:ex.description,
      status: data.status!==undefined?data.status:ex.status,
      priority: data.priority!==undefined?data.priority:ex.priority,
      client_name: data.client_name!==undefined?data.client_name:ex.client_name,
      client_id: data.client_id!==undefined?data.client_id:ex.client_id,
      budget: data.budget!==undefined?parseFloat(data.budget)||0:ex.budget,
      spent: data.spent!==undefined?parseFloat(data.spent)||0:ex.spent,
      start_date: data.start_date!==undefined?data.start_date:ex.start_date,
      end_date: data.end_date!==undefined?data.end_date:ex.end_date,
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
    all.forEach(function(p){if(byStatus[p.status]!==undefined)byStatus[p.status]++})
    var totalBudget = all.reduce(function(s,p){return s+(parseFloat(p.budget)||0)},0)
    var totalSpent  = all.reduce(function(s,p){return s+(parseFloat(p.spent)||0)},0)
    return { total: all.length, by_status: byStatus, total_budget: totalBudget, total_spent: totalSpent }
  }
  return { getAll, getById, create, update, remove, getSummary }
})()
