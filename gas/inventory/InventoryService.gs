var InventoryService = (function () {
  var SHEET = CONFIG.SHEETS.INVENTORY

  function getAll() {
    var inventory = SheetService.getAll(SHEET)
    var products  = SheetService.getAll(CONFIG.SHEETS.PRODUCTS)
    return inventory.map(function(inv){
      var p = products.find(function(pp){return pp.id===inv.product_id}) || {}
      return Object.assign({}, inv, {
        product_name: p.name||'', product_sku: p.sku||'', product_category: p.category||'',
        product_price: p.price||0, product_cost: p.cost||0, product_unit: p.unit||'pcs',
        product_active: p.is_active,
      })
    })
  }

  function getLowStock() {
    return getAll().filter(function(i){
      var qty=parseFloat(i.quantity)||0, min=parseFloat(i.min_stock)||0
      return min>0 && qty<=min
    })
  }

  function getInventoryRow(productId) {
    var row = SheetService.findByField(SHEET, 'product_id', productId)
    if (!row) throw new Error('Inventory row not found for product')
    return row
  }

  function recordMovement(productId, type, quantity, notes, reference) {
    SheetService.insert(CONFIG.SHEETS.STOCK_MOVEMENTS, {
      id: Utilities.getUuid(), product_id: productId, type: type,
      quantity: quantity, reference: reference||'', notes: notes||'',
      created_at: new Date().toISOString(),
    })
  }

  function getWithProduct(productId) {
    var inv = getInventoryRow(productId)
    var p = SheetService.findById(CONFIG.SHEETS.PRODUCTS, productId) || {}
    return Object.assign({}, inv, {
      product_name: p.name||'', product_sku: p.sku||'', product_category: p.category||'',
      product_price: p.price||0, product_cost: p.cost||0, product_unit: p.unit||'pcs',
    })
  }

  function stockIn(productId, quantity, notes, reference) {
    var inv = getInventoryRow(productId)
    var newQty = (parseFloat(inv.quantity)||0) + (parseFloat(quantity)||0)
    SheetService.updateByField(SHEET, 'product_id', productId, { quantity: newQty, updated_at: new Date().toISOString() })
    recordMovement(productId, 'in', quantity, notes, reference)
    return getWithProduct(productId)
  }

  function stockOut(productId, quantity, notes, reference) {
    var inv = getInventoryRow(productId)
    var current = parseFloat(inv.quantity)||0
    var qty = parseFloat(quantity)||0
    if (qty > current) throw new Error('Stok tidak cukup. Stok saat ini: ' + current)
    var newQty = current - qty
    SheetService.updateByField(SHEET, 'product_id', productId, { quantity: newQty, updated_at: new Date().toISOString() })
    recordMovement(productId, 'out', quantity, notes, reference)
    return getWithProduct(productId)
  }

  function adjustStock(productId, newQuantity, notes) {
    SheetService.updateByField(SHEET, 'product_id', productId, { quantity: parseFloat(newQuantity)||0, updated_at: new Date().toISOString() })
    recordMovement(productId, 'adjustment', newQuantity, notes, '')
    return getWithProduct(productId)
  }

  function updateMinStock(productId, minStock, location) {
    var partial = { updated_at: new Date().toISOString() }
    if (minStock!==undefined) partial.min_stock = parseFloat(minStock)||0
    if (location!==undefined) partial.location = location
    SheetService.updateByField(SHEET, 'product_id', productId, partial)
    return getWithProduct(productId)
  }

  function getMovements(productId) {
    var movements = SheetService.getAll(CONFIG.SHEETS.STOCK_MOVEMENTS)
    var products  = SheetService.getAll(CONFIG.SHEETS.PRODUCTS)
    var filtered = productId ? movements.filter(function(m){return m.product_id===productId}) : movements
    return filtered
      .map(function(m){
        var p = products.find(function(pp){return pp.id===m.product_id}) || {}
        return Object.assign({}, m, { product_name: p.name||'', product_sku: p.sku||'' })
      })
      .sort(function(a,b){ return new Date(b.created_at)-new Date(a.created_at) })
  }

  return { getAll, getLowStock, stockIn, stockOut, adjustStock, updateMinStock, getMovements, getWithProduct }
})()
