var DashboardController = (function () {
  function requireSession(token) {
    if (!token) throw new Error('Unauthorized')
    var s = SessionManager.validate(token)
    if (!s) throw new Error('Session expired or invalid')
    return s
  }
  function getSummary(p, t) {
    try { requireSession(t); return successResponse(DashboardService.getSummary()) }
    catch (e) { return errorResponse(e.message) }
  }
  return { getSummary }
})()
