var SheetService = (function () {

  function getSheet(name) {
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = ss.getSheetByName(name)
    if (!sheet) throw new Error('Sheet not found: ' + name)
    return sheet
  }

  function getAll(sheetName) {
    var sheet = getSheet(sheetName)
    var values = sheet.getDataRange().getValues()
    if (values.length < 2) return []
    var headers = values[0]
    var rows = []
    for (var i = 1; i < values.length; i++) {
      var row = {}
      for (var j = 0; j < headers.length; j++) {
        var val = values[i][j]
        if (val instanceof Date) val = val.toISOString()
        row[headers[j]] = val
      }
      rows.push(row)
    }
    return rows
  }

  function findById(sheetName, id) {
    return findByField(sheetName, 'id', id)
  }

  function findByField(sheetName, field, value) {
    var all = getAll(sheetName)
    for (var i = 0; i < all.length; i++) {
      if (String(all[i][field]) === String(value)) return all[i]
    }
    return null
  }

  function insert(sheetName, rowObject) {
    var sheet = getSheet(sheetName)
    var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
    var row = headers.map(function (h) {
      var v = rowObject[h]
      return v === undefined || v === null ? '' : v
    })
    sheet.appendRow(row)
    return rowObject
  }

  function updateById(sheetName, id, partial) {
    return updateByField(sheetName, 'id', id, partial)
  }

  function updateByField(sheetName, field, value, partial) {
    var sheet = getSheet(sheetName)
    var data = sheet.getDataRange().getValues()
    var headers = data[0]
    var fieldIdx = headers.indexOf(field)
    if (fieldIdx === -1) throw new Error('Field not found: ' + field)

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][fieldIdx]) === String(value)) {
        Object.keys(partial).forEach(function (key) {
          var colIdx = headers.indexOf(key)
          if (colIdx !== -1) {
            var v = partial[key]
            sheet.getRange(i + 1, colIdx + 1).setValue(v === undefined || v === null ? '' : v)
          }
        })
        return true
      }
    }
    throw new Error('Record not found: ' + value)
  }

  function deleteById(sheetName, id) {
    return deleteByField(sheetName, 'id', id)
  }

  function deleteByField(sheetName, field, value) {
    var sheet = getSheet(sheetName)
    var data = sheet.getDataRange().getValues()
    var headers = data[0]
    var fieldIdx = headers.indexOf(field)
    if (fieldIdx === -1) throw new Error('Field not found: ' + field)

    for (var i = 1; i < data.length; i++) {
      if (String(data[i][fieldIdx]) === String(value)) {
        sheet.deleteRow(i + 1)
        return true
      }
    }
    throw new Error('Record not found: ' + value)
  }

  return { getSheet, getAll, findById, findByField, insert, updateById, updateByField, deleteById, deleteByField }
})()
