var SettingsService = (function () {
  var SHEET = CONFIG.SHEETS.SETTINGS

  function getAll() {
    var rows = SheetService.getAll(SHEET)
    var result = {}
    rows.forEach(function(r){ result[r.key]=r.value })
    return result
  }
  function get(key) {
    var row = SheetService.findByField(SHEET, 'key', key)
    return row ? row.value : null
  }
  function set(key, value) {
    var existing = SheetService.findByField(SHEET, 'key', key)
    var now = new Date().toISOString()
    if (existing) {
      SheetService.updateById(SHEET, existing.id, { value: value, updated_at: now })
    } else {
      SheetService.insert(SHEET, { id: Utilities.getUuid(), key: key, value: value, created_at: now, updated_at: now })
    }
    return { key: key, value: value }
  }
  function setMany(data) {
    Object.keys(data).forEach(function(key){ set(key, data[key]) })
    return getAll()
  }
  return { getAll, get, set, setMany }
})()
