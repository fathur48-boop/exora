var ReportsController = (function () {
  function requireSession(token) {
    if (!token) throw new Error('Unauthorized')
    var s = SessionManager.validate(token)
    if (!s) throw new Error('Session expired or invalid')
    return s
  }
  function getFullReport(p,t)      { try { requireSession(t); return successResponse(ReportsService.getFullReport()) } catch(e){return errorResponse(e.message)} }
  function getRevenueReport(p,t)   { try { requireSession(t); return successResponse(ReportsService.getRevenueReport()) } catch(e){return errorResponse(e.message)} }
  function getLeadsReport(p,t)     { try { requireSession(t); return successResponse(ReportsService.getLeadsReport()) } catch(e){return errorResponse(e.message)} }
  function getInventoryReport(p,t) { try { requireSession(t); return successResponse(ReportsService.getInventoryReport()) } catch(e){return errorResponse(e.message)} }
  function getHrReport(p,t)        { try { requireSession(t); return successResponse(ReportsService.getHrReport()) } catch(e){return errorResponse(e.message)} }
  function getProjectsReport(p,t)  { try { requireSession(t); return successResponse(ReportsService.getProjectsReport()) } catch(e){return errorResponse(e.message)} }
  return { getFullReport, getRevenueReport, getLeadsReport, getInventoryReport, getHrReport, getProjectsReport }
})()
