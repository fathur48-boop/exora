var ProductService = (function () {
  var SHEET = CONFIG.SHEETS.PRODUCTS

  function getAll() { return SheetService.getAll(SHEET) }
  function getById(id) {
    var p = SheetService.findById(SHEET, id)
    if (!p) throw new Error('Product not found')
    return p
  }
  function generateSku(name) {
    var prefix = (name||'PRD').substring(0,3).toUpperCase().replace(/[^A-Z]/g,'X')
    return prefix + '-' + Math.floor(100000 + Math.random()*900000)
  }
  function create(data) {
    var now = new Date().toISOString()
    var p = {
      id: Utilities.getUuid(), name: data.name||'', sku: data.sku||generateSku(data.name),
      category: data.category||'', description: data.description||'',
      price: parseFloat(data.price)||0, cost: parseFloat(data.cost)||0,
      unit: data.unit||'pcs', is_active: data.is_active!==undefined?data.is_active:true,
      created_at: now, updated_at: now,
    }
    if (!p.name.trim()) throw new Error('Nama produk wajib diisi')
    SheetService.insert(SHEET, p)
    // Initialize inventory row
    SheetService.insert(CONFIG.SHEETS.INVENTORY, {
      product_id: p.id, quantity: 0, min_stock: 0, location: '', updated_at: now,
    })
    return p
  }
  function update(id, data) {
    var ex = getById(id)
    var now = new Date().toISOString()
    var partial = {
      name: data.name!==undefined?data.name:ex.name,
      sku: data.sku!==undefined?data.sku:ex.sku,
      category: data.category!==undefined?data.category:ex.category,
      description: data.description!==undefined?data.description:ex.description,
      price: data.price!==undefined?parseFloat(data.price)||0:ex.price,
      cost: data.cost!==undefined?parseFloat(data.cost)||0:ex.cost,
      unit: data.unit!==undefined?data.unit:ex.unit,
      is_active: data.is_active!==undefined?data.is_active:ex.is_active,
      updated_at: now,
    }
    SheetService.updateById(SHEET, id, partial)
    return Object.assign({}, ex, partial)
  }
  function remove(id) {
    getById(id)
    SheetService.deleteById(SHEET, id)
    try { SheetService.deleteByField(CONFIG.SHEETS.INVENTORY, 'product_id', id) } catch(e) {}
    return { ok: true }
  }
  return { getAll, getById, create, update, remove }
})()
