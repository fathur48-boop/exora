function doPost(e) {
  try {
    var body    = JSON.parse(e.postData.contents)
    var action  = body.action
    var payload = body.payload || {}
    var token   = body._token  || null

    switch (action) {
      case 'auth.login':                    return AuthController.login(payload)
      case 'auth.validateSession':          return AuthController.validateSession(payload)
      case 'auth.logout':                   return AuthController.logout(payload)

      case 'dashboard.getSummary':          return DashboardController.getSummary(payload, token)

      case 'crm.getCustomers':              return CrmController.getCustomers(payload, token)
      case 'crm.getCustomer':               return CrmController.getCustomer(payload, token)
      case 'crm.createCustomer':            return CrmController.createCustomer(payload, token)
      case 'crm.updateCustomer':            return CrmController.updateCustomer(payload, token)
      case 'crm.deleteCustomer':            return CrmController.deleteCustomer(payload, token)
      case 'crm.getLeads':                  return CrmController.getLeads(payload, token)
      case 'crm.getLead':                   return CrmController.getLead(payload, token)
      case 'crm.createLead':                return CrmController.createLead(payload, token)
      case 'crm.updateLead':                return CrmController.updateLead(payload, token)
      case 'crm.updateLeadStage':           return CrmController.updateLeadStage(payload, token)
      case 'crm.deleteLead':                return CrmController.deleteLead(payload, token)
      case 'crm.getActivities':             return CrmController.getActivities(payload, token)
      case 'crm.createActivity':            return CrmController.createActivity(payload, token)
      case 'crm.deleteActivity':            return CrmController.deleteActivity(payload, token)

      case 'ai.chat':                       return AiController.chat(payload, token)

      case 'inventory.getProducts':         return InventoryController.getProducts(payload, token)
      case 'inventory.getProduct':          return InventoryController.getProduct(payload, token)
      case 'inventory.createProduct':       return InventoryController.createProduct(payload, token)
      case 'inventory.updateProduct':       return InventoryController.updateProduct(payload, token)
      case 'inventory.deleteProduct':       return InventoryController.deleteProduct(payload, token)
      case 'inventory.getInventory':        return InventoryController.getInventory(payload, token)
      case 'inventory.getLowStock':         return InventoryController.getLowStock(payload, token)
      case 'inventory.stockIn':             return InventoryController.stockIn(payload, token)
      case 'inventory.stockOut':            return InventoryController.stockOut(payload, token)
      case 'inventory.adjustStock':         return InventoryController.adjustStock(payload, token)
      case 'inventory.updateMinStock':      return InventoryController.updateMinStock(payload, token)
      case 'inventory.getMovements':        return InventoryController.getMovements(payload, token)

      case 'finance.getTransactions':       return FinanceController.getTransactions(payload, token)
      case 'finance.getTransaction':        return FinanceController.getTransaction(payload, token)
      case 'finance.createTransaction':     return FinanceController.createTransaction(payload, token)
      case 'finance.updateTransaction':     return FinanceController.updateTransaction(payload, token)
      case 'finance.deleteTransaction':     return FinanceController.deleteTransaction(payload, token)
      case 'finance.getSummary':            return FinanceController.getSummary(payload, token)

      case 'projects.getProjects':          return ProjectsController.getProjects(payload, token)
      case 'projects.getProject':           return ProjectsController.getProject(payload, token)
      case 'projects.createProject':        return ProjectsController.createProject(payload, token)
      case 'projects.updateProject':        return ProjectsController.updateProject(payload, token)
      case 'projects.deleteProject':        return ProjectsController.deleteProject(payload, token)
      case 'projects.getSummary':           return ProjectsController.getProjectSummary(payload, token)
      case 'projects.getTasks':             return ProjectsController.getTasks(payload, token)
      case 'projects.createTask':           return ProjectsController.createTask(payload, token)
      case 'projects.updateTask':           return ProjectsController.updateTask(payload, token)
      case 'projects.updateTaskStatus':     return ProjectsController.updateTaskStatus(payload, token)
      case 'projects.deleteTask':           return ProjectsController.deleteTask(payload, token)

      case 'hr.getEmployees':               return HrController.getEmployees(payload, token)
      case 'hr.getEmployee':                return HrController.getEmployee(payload, token)
      case 'hr.createEmployee':             return HrController.createEmployee(payload, token)
      case 'hr.updateEmployee':             return HrController.updateEmployee(payload, token)
      case 'hr.deleteEmployee':             return HrController.deleteEmployee(payload, token)
      case 'hr.getSummary':                 return HrController.getHrSummary(payload, token)
      case 'hr.getAttendanceByEmployee':    return HrController.getAttendanceByEmployee(payload, token)
      case 'hr.getAttendanceByDate':        return HrController.getAttendanceByDate(payload, token)
      case 'hr.recordAttendance':           return HrController.recordAttendance(payload, token)
      case 'hr.getMonthlySummary':          return HrController.getMonthlySummary(payload, token)
      case 'hr.getLeaveRequests':           return HrController.getLeaveRequests(payload, token)
      case 'hr.getLeaveByEmployee':         return HrController.getLeaveByEmployee(payload, token)
      case 'hr.createLeave':                return HrController.createLeave(payload, token)
      case 'hr.updateLeaveStatus':          return HrController.updateLeaveStatus(payload, token)
      case 'hr.deleteLeave':                return HrController.deleteLeave(payload, token)

      case 'reports.getFullReport':         return ReportsController.getFullReport(payload, token)
      case 'reports.getRevenueReport':      return ReportsController.getRevenueReport(payload, token)
      case 'reports.getLeadsReport':        return ReportsController.getLeadsReport(payload, token)
      case 'reports.getInventoryReport':    return ReportsController.getInventoryReport(payload, token)
      case 'reports.getHrReport':           return ReportsController.getHrReport(payload, token)
      case 'reports.getProjectsReport':     return ReportsController.getProjectsReport(payload, token)

      case 'settings.getSettings':          return SettingsController.getSettings(payload, token)
      case 'settings.updateSettings':       return SettingsController.updateSettings(payload, token)
      case 'settings.getUsers':             return SettingsController.getUsers(payload, token)
      case 'settings.createUser':           return SettingsController.createUser(payload, token)
      case 'settings.updateUser':           return SettingsController.updateUser(payload, token)
      case 'settings.deleteUser':           return SettingsController.deleteUser(payload, token)

      default: return errorResponse('Unknown action: ' + action, 'UNKNOWN_ACTION')
    }
  } catch (err) {
    return errorResponse(err.message, 'INTERNAL_ERROR')
  }
}

function doGet(e)     { return errorResponse('GET not supported', 'METHOD_NOT_ALLOWED') }
function doOptions(e) { return ContentService.createTextOutput('').setMimeType(ContentService.MimeType.JSON) }
