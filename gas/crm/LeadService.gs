var LeadService = (function () {
  var SHEET = CONFIG.SHEETS.LEADS
  var STAGES = ['new','contacted','qualified','proposal','negotiation','closed','lost']
  var SOURCES = ['website','referral','social','cold_call','other']

  function getAll() {
    return SheetService.getAll(SHEET).sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at)})
  }
  function getById(id) {
    var l = SheetService.findById(SHEET, id)
    if (!l) throw new Error('Lead not found')
    return l
  }
  function create(data) {
    var now = new Date().toISOString()
    var l = {
      id: Utilities.getUuid(), name: data.name||'', email: data.email||'', phone: data.phone||'',
      company: data.company||'', source: data.source||'other', stage: data.stage||'new',
      value: parseFloat(data.value)||0, notes: data.notes||'', created_at: now, updated_at: now,
    }
    if (!l.name.trim()) throw new Error('Nama wajib diisi')
    if (STAGES.indexOf(l.stage)===-1) throw new Error('Stage tidak valid')
    if (SOURCES.indexOf(l.source)===-1) throw new Error('Source tidak valid')
    SheetService.insert(SHEET, l)
    return l
  }
  function update(id, data) {
    var ex = getById(id)
    var now = new Date().toISOString()
    var partial = {
      name: data.name!==undefined?data.name:ex.name,
      email: data.email!==undefined?data.email:ex.email,
      phone: data.phone!==undefined?data.phone:ex.phone,
      company: data.company!==undefined?data.company:ex.company,
      source: data.source!==undefined?data.source:ex.source,
      stage: data.stage!==undefined?data.stage:ex.stage,
      value: data.value!==undefined?parseFloat(data.value)||0:ex.value,
      notes: data.notes!==undefined?data.notes:ex.notes,
      updated_at: now,
    }
    SheetService.updateById(SHEET, id, partial)
    return Object.assign({}, ex, partial)
  }
  function updateStage(id, stage) {
    if (STAGES.indexOf(stage)===-1) throw new Error('Stage tidak valid')
    return update(id, { stage: stage })
  }
  function remove(id) {
    getById(id)
    SheetService.deleteById(SHEET, id)
    return { ok: true }
  }
  return { getAll, getById, create, update, updateStage, remove }
})()
