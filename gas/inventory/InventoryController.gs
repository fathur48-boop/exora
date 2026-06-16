var InventoryController = (function () {
  function requireSession(token) {
    if (!token) throw new Error('Unauthorized')
    var s = SessionManager.validate(token)
    if (!s) throw new Error('Session expired or invalid')
    return s
  }

  function getProducts(p,t) { try { requireSession(t); return successResponse(ProductService.getAll()) } catch(e){return errorResponse(e.message)} }
  function getProduct(p,t)  { try { requireSession(t); return successResponse(ProductService.getById(p.id)) } catch(e){return errorResponse(e.message)} }
  function createProduct(p,t) { try { requireSession(t); return successResponse(ProductService.create(p),'Product created') } catch(e){return errorResponse(e.message)} }
  function updateProduct(p,t) { try { requireSession(t); return successResponse(ProductService.update(p.id,p),'Product updated') } catch(e){return errorResponse(e.message)} }
  function deleteProduct(p,t) { try { requireSession(t); return successResponse(ProductService.remove(p.id),'Product deleted') } catch(e){return errorResponse(e.message)} }

  function getInventory(p,t) { try { requireSession(t); return successResponse(InventoryService.getAll()) } catch(e){return errorResponse(e.message)} }
  function getLowStock(p,t)  { try { requireSession(t); return successResponse(InventoryService.getLowStock()) } catch(e){return errorResponse(e.message)} }

  function stockIn(p,t)  { try { requireSession(t); return successResponse(InventoryService.stockIn(p.product_id,p.quantity,p.notes,p.reference),'Stock in recorded') } catch(e){return errorResponse(e.message)} }
  function stockOut(p,t) { try { requireSession(t); return successResponse(InventoryService.stockOut(p.product_id,p.quantity,p.notes,p.reference),'Stock out recorded') } catch(e){return errorResponse(e.message)} }
  function adjustStock(p,t) { try { requireSession(t); return successResponse(InventoryService.adjustStock(p.product_id,p.quantity,p.notes),'Stock adjusted') } catch(e){return errorResponse(e.message)} }
  function updateMinStock(p,t) { try { requireSession(t); return successResponse(InventoryService.updateMinStock(p.product_id,p.min_stock,p.location),'Settings saved') } catch(e){return errorResponse(e.message)} }

  function getMovements(p,t) { try { requireSession(t); return successResponse(InventoryService.getMovements(p.product_id||null)) } catch(e){return errorResponse(e.message)} }

  return { getProducts,getProduct,createProduct,updateProduct,deleteProduct,getInventory,getLowStock,stockIn,stockOut,adjustStock,updateMinStock,getMovements }
})()
