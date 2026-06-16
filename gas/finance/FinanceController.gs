var FinanceController = (function () {
  function requireSession(token) {
    if (!token) throw new Error('Unauthorized')
    var s = SessionManager.validate(token)
    if (!s) throw new Error('Session expired or invalid')
    return s
  }
  function getTransactions(p,t) { try { requireSession(t); return successResponse(TransactionService.getAll()) } catch(e){return errorResponse(e.message)} }
  function getTransaction(p,t)  { try { requireSession(t); return successResponse(TransactionService.getById(p.id)) } catch(e){return errorResponse(e.message)} }
  function createTransaction(p,t) { try { requireSession(t); return successResponse(TransactionService.create(p),'Transaction created') } catch(e){return errorResponse(e.message)} }
  function updateTransaction(p,t) { try { requireSession(t); return successResponse(TransactionService.update(p.id,p),'Transaction updated') } catch(e){return errorResponse(e.message)} }
  function deleteTransaction(p,t) { try { requireSession(t); return successResponse(TransactionService.remove(p.id),'Transaction deleted') } catch(e){return errorResponse(e.message)} }
  function getSummary(p,t) { try { requireSession(t); return successResponse(TransactionService.getSummary()) } catch(e){return errorResponse(e.message)} }
  return { getTransactions,getTransaction,createTransaction,updateTransaction,deleteTransaction,getSummary }
})()
