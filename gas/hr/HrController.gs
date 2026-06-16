var HrController = (function () {
  function requireSession(token) {
    if (!token) throw new Error('Unauthorized')
    var s = SessionManager.validate(token)
    if (!s) throw new Error('Session expired or invalid')
    return s
  }

  function getEmployees(p,t) { try { requireSession(t); return successResponse(EmployeeService.getAll()) } catch(e){return errorResponse(e.message)} }
  function getEmployee(p,t)  { try { requireSession(t); return successResponse(EmployeeService.getById(p.id)) } catch(e){return errorResponse(e.message)} }
  function createEmployee(p,t) { try { requireSession(t); return successResponse(EmployeeService.create(p),'Employee created') } catch(e){return errorResponse(e.message)} }
  function updateEmployee(p,t) { try { requireSession(t); return successResponse(EmployeeService.update(p.id,p),'Employee updated') } catch(e){return errorResponse(e.message)} }
  function deleteEmployee(p,t) { try { requireSession(t); return successResponse(EmployeeService.remove(p.id),'Employee deleted') } catch(e){return errorResponse(e.message)} }
  function getHrSummary(p,t) { try { requireSession(t); return successResponse(EmployeeService.getSummary()) } catch(e){return errorResponse(e.message)} }

  function getAttendanceByEmployee(p,t) { try { requireSession(t); return successResponse(AttendanceService.getByEmployee(p.employee_id)) } catch(e){return errorResponse(e.message)} }
  function getAttendanceByDate(p,t) { try { requireSession(t); return successResponse(AttendanceService.getByDate(p.date)) } catch(e){return errorResponse(e.message)} }
  function recordAttendance(p,t) { try { requireSession(t); return successResponse(AttendanceService.record(p),'Attendance recorded') } catch(e){return errorResponse(e.message)} }
  function getMonthlySummary(p,t) { try { requireSession(t); return successResponse(AttendanceService.getMonthlySummary(p.employee_id,parseInt(p.year),parseInt(p.month))) } catch(e){return errorResponse(e.message)} }

  function getLeaveRequests(p,t) { try { requireSession(t); return successResponse(LeaveService.getAll()) } catch(e){return errorResponse(e.message)} }
  function getLeaveByEmployee(p,t) { try { requireSession(t); return successResponse(LeaveService.getByEmployee(p.employee_id)) } catch(e){return errorResponse(e.message)} }
  function createLeave(p,t) { try { requireSession(t); return successResponse(LeaveService.create(p),'Leave request submitted') } catch(e){return errorResponse(e.message)} }
  function updateLeaveStatus(p,t) { try { var s=requireSession(t); return successResponse(LeaveService.updateStatus(p.id,p.status,s.user_id),'Leave status updated') } catch(e){return errorResponse(e.message)} }
  function deleteLeave(p,t) { try { requireSession(t); return successResponse(LeaveService.remove(p.id),'Leave request deleted') } catch(e){return errorResponse(e.message)} }

  return {
    getEmployees,getEmployee,createEmployee,updateEmployee,deleteEmployee,getHrSummary,
    getAttendanceByEmployee,getAttendanceByDate,recordAttendance,getMonthlySummary,
    getLeaveRequests,getLeaveByEmployee,createLeave,updateLeaveStatus,deleteLeave,
  }
})()
