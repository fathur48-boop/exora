function successResponse(data, message) {
  var payload = { success: true, data: data }
  if (message) payload.message = message
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON)
}

function errorResponse(message, code) {
  var payload = { success: false, message: message || 'An error occurred' }
  if (code) payload.code = code
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON)
}
