var CrmController = (function () {
  function requireSession(token) {
    if (!token) throw new Error('Unauthorized')
    var s = SessionManager.validate(token)
    if (!s) throw new Error('Session expired or invalid')
    return s
  }

  // Customers
  function getCustomers(p,t) { try { requireSession(t); return successResponse(CustomerService.getAll()) } catch(e){return errorResponse(e.message)} }
  function getCustomer(p,t)  { try { requireSession(t); return successResponse(CustomerService.getById(p.id)) } catch(e){return errorResponse(e.message)} }
  function createCustomer(p,t) { try { requireSession(t); return successResponse(CustomerService.create(p),'Customer created') } catch(e){return errorResponse(e.message)} }
  function updateCustomer(p,t) { try { requireSession(t); return successResponse(CustomerService.update(p.id,p),'Customer updated') } catch(e){return errorResponse(e.message)} }
  function deleteCustomer(p,t) { try { requireSession(t); return successResponse(CustomerService.remove(p.id),'Customer deleted') } catch(e){return errorResponse(e.message)} }

  // Leads
  function getLeads(p,t) { try { requireSession(t); return successResponse(LeadService.getAll()) } catch(e){return errorResponse(e.message)} }
  function getLead(p,t)  { try { requireSession(t); return successResponse(LeadService.getById(p.id)) } catch(e){return errorResponse(e.message)} }
  function createLead(p,t) { try { requireSession(t); return successResponse(LeadService.create(p),'Lead created') } catch(e){return errorResponse(e.message)} }
  function updateLead(p,t) { try { requireSession(t); return successResponse(LeadService.update(p.id,p),'Lead updated') } catch(e){return errorResponse(e.message)} }
  function updateLeadStage(p,t) { try { requireSession(t); return successResponse(LeadService.updateStage(p.id,p.stage),'Stage updated') } catch(e){return errorResponse(e.message)} }
  function deleteLead(p,t) { try { requireSession(t); return successResponse(LeadService.remove(p.id),'Lead deleted') } catch(e){return errorResponse(e.message)} }

  // Activities
  function getActivities(p,t) { try { requireSession(t); return successResponse(ActivityService.getByEntity(p.entity_type,p.entity_id)) } catch(e){return errorResponse(e.message)} }
  function createActivity(p,t) { try { requireSession(t); return successResponse(ActivityService.create(p),'Activity logged') } catch(e){return errorResponse(e.message)} }
  function deleteActivity(p,t) { try { requireSession(t); return successResponse(ActivityService.remove(p.id),'Activity deleted') } catch(e){return errorResponse(e.message)} }

  return {
    getCustomers,getCustomer,createCustomer,updateCustomer,deleteCustomer,
    getLeads,getLead,createLead,updateLead,updateLeadStage,deleteLead,
    getActivities,createActivity,deleteActivity,
  }
})()
