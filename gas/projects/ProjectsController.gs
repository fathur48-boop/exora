var ProjectsController = (function () {
  function requireSession(token) {
    if (!token) throw new Error('Unauthorized')
    var s = SessionManager.validate(token)
    if (!s) throw new Error('Session expired or invalid')
    return s
  }
  function getProjects(p,t) { try { requireSession(t); return successResponse(ProjectService.getAll()) } catch(e){return errorResponse(e.message)} }
  function getProject(p,t)  { try { requireSession(t); return successResponse(ProjectService.getById(p.id)) } catch(e){return errorResponse(e.message)} }
  function createProject(p,t) { try { var s=requireSession(t); return successResponse(ProjectService.create(p,s.user_id),'Project created') } catch(e){return errorResponse(e.message)} }
  function updateProject(p,t) { try { requireSession(t); return successResponse(ProjectService.update(p.id,p),'Project updated') } catch(e){return errorResponse(e.message)} }
  function deleteProject(p,t) { try { requireSession(t); TaskService.removeByProject(p.id); return successResponse(ProjectService.remove(p.id),'Project deleted') } catch(e){return errorResponse(e.message)} }
  function getProjectSummary(p,t) { try { requireSession(t); return successResponse(ProjectService.getSummary()) } catch(e){return errorResponse(e.message)} }

  function getTasks(p,t) { try { requireSession(t); return successResponse(TaskService.getByProject(p.project_id)) } catch(e){return errorResponse(e.message)} }
  function createTask(p,t) { try { requireSession(t); return successResponse(TaskService.create(p),'Task created') } catch(e){return errorResponse(e.message)} }
  function updateTask(p,t) { try { requireSession(t); return successResponse(TaskService.update(p.id,p),'Task updated') } catch(e){return errorResponse(e.message)} }
  function updateTaskStatus(p,t) { try { requireSession(t); return successResponse(TaskService.updateStatus(p.id,p.status),'Task status updated') } catch(e){return errorResponse(e.message)} }
  function deleteTask(p,t) { try { requireSession(t); return successResponse(TaskService.remove(p.id),'Task deleted') } catch(e){return errorResponse(e.message)} }

  return { getProjects,getProject,createProject,updateProject,deleteProject,getProjectSummary,getTasks,createTask,updateTask,updateTaskStatus,deleteTask }
})()
