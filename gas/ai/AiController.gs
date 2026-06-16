var AiController = (function () {
  function requireSession(token) {
    if (!token) throw new Error('Unauthorized')
    var s = SessionManager.validate(token)
    if (!s) throw new Error('Session expired or invalid')
    return s
  }
  function chat(p,t) {
    try {
      requireSession(t)
      if (!p.messages || !p.messages.length) throw new Error('messages wajib diisi')
      return successResponse(AiService.chat(p.messages))
    } catch(e) { return errorResponse(e.message) }
  }
  return { chat }
})()
