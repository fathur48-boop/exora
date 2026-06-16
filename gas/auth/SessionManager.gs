var SessionManager = (function () {
  var SHEET = CONFIG.SHEETS.SESSIONS

  function ensureSheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = ss.getSheetByName(SHEET)
    if (!sheet) {
      sheet = ss.insertSheet(SHEET)
      sheet.appendRow(['token','user_id','role','created_at','expires_at'])
      sheet.getRange(1,1,1,5).setFontWeight('bold')
    }
  }

  function create(user) {
    ensureSheet()
    var token = Utilities.getUuid()
    var now = new Date()
    var expires = new Date(now.getTime() + CONFIG.SESSION_DURATION_MS)
    SheetService.insert(SHEET, {
      token: token,
      user_id: user.id,
      role: user.role,
      created_at: now.toISOString(),
      expires_at: expires.toISOString(),
    })
    return token
  }

  function validate(token) {
    ensureSheet()
    var session = SheetService.findByField(SHEET, 'token', token)
    if (!session) return null
    if (new Date(session.expires_at) < new Date()) {
      SheetService.deleteByField(SHEET, 'token', token)
      return null
    }
    return session
  }

  function destroy(token) {
    ensureSheet()
    try { SheetService.deleteByField(SHEET, 'token', token) } catch (e) {}
    return true
  }

  return { create, validate, destroy }
})()
