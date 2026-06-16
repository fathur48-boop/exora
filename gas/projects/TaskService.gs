var TaskService = (function () {
  var SHEET = CONFIG.SHEETS.TASKS
  var STATUSES = ['todo','in_progress','review','done']
  var PRIORITIES = ['low','medium','high','critical']

  function getByProject(projectId) {
    return SheetService.getAll(SHEET)
      .filter(function(t){return t.project_id===projectId})
      .sort(function(a,b){return new Date(a.created_at)-new Date(b.created_at)})
  }
  function getById(id) {
    var t = SheetService.findById(SHEET, id)
    if (!t) throw new Error('Task not found')
    return t
  }
  function create(data) {
    var now = new Date().toISOString()
    var t = {
      id: Utilities.getUuid(), project_id: data.project_id||'', title: data.title||'',
      description: data.description||'', status: data.status||'todo', priority: data.priority||'medium',
      assigned_to: data.assigned_to||'', assigned_name: data.assigned_name||'',
      due_date: data.due_date||'', created_at: now, updated_at: now,
    }
    if (!t.project_id) throw new Error('project_id is required')
    if (!t.title.trim()) throw new Error('Task title is required')
    if (STATUSES.indexOf(t.status)===-1) throw new Error('Invalid task status')
    if (PRIORITIES.indexOf(t.priority)===-1) throw new Error('Invalid task priority')
    SheetService.insert(SHEET, t)
    return t
  }
  function update(id, data) {
    var ex = getById(id)
    var now = new Date().toISOString()
    var partial = {
      title: data.title!==undefined?data.title:ex.title,
      description: data.description!==undefined?data.description:ex.description,
      status: data.status!==undefined?data.status:ex.status,
      priority: data.priority!==undefined?data.priority:ex.priority,
      assigned_to: data.assigned_to!==undefined?data.assigned_to:ex.assigned_to,
      assigned_name: data.assigned_name!==undefined?data.assigned_name:ex.assigned_name,
      due_date: data.due_date!==undefined?data.due_date:ex.due_date,
      updated_at: now,
    }
    SheetService.updateById(SHEET, id, partial)
    return Object.assign({}, ex, partial)
  }
  function updateStatus(id, status) {
    if (STATUSES.indexOf(status)===-1) throw new Error('Invalid task status')
    return update(id, { status: status })
  }
  function remove(id) {
    getById(id)
    SheetService.deleteById(SHEET, id)
    return { ok: true }
  }
  function removeByProject(projectId) {
    var all = SheetService.getAll(SHEET)
    all.filter(function(t){return t.project_id===projectId}).forEach(function(t){SheetService.deleteById(SHEET,t.id)})
    return { ok: true }
  }
  return { getByProject, getById, create, update, updateStatus, remove, removeByProject }
})()
