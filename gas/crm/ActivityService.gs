var ActivityService = (function () {
  var SHEET = CONFIG.SHEETS.ACTIVITIES
  var TYPES = ['note','call','email','meeting']

  function getByEntity(entityType, entityId) {
    return SheetService.getAll(SHEET)
      .filter(function(a){return a.entity_type===entityType && a.entity_id===entityId})
      .sort(function(a,b){return new Date(b.created_at)-new Date(a.created_at)})
  }
  function create(data) {
    var now = new Date().toISOString()
    var a = {
      id: Utilities.getUuid(), entity_type: data.entity_type||'', entity_id: data.entity_id||'',
      type: data.type||'note', description: data.description||'', created_at: now,
    }
    if (!a.entity_type || !a.entity_id) throw new Error('entity_type dan entity_id wajib diisi')
    if (TYPES.indexOf(a.type)===-1) throw new Error('Tipe aktivitas tidak valid')
    if (!a.description.trim()) throw new Error('Deskripsi wajib diisi')
    SheetService.insert(SHEET, a)
    return a
  }
  function remove(id) {
    var a = SheetService.findById(SHEET, id)
    if (!a) throw new Error('Activity not found')
    SheetService.deleteById(SHEET, id)
    return { ok: true }
  }
  return { getByEntity, create, remove }
})()
