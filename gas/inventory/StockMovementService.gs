var StockMovementService = (function () {
  function ensureSheet() {
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = ss.getSheetByName(CONFIG.SHEETS.STOCK_MOVEMENTS)
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHEETS.STOCK_MOVEMENTS)
      sheet.appendRow(['id','product_id','type','quantity','reference','notes','created_at'])
      sheet.getRange(1,1,1,7).setFontWeight('bold')
    }
  }
  function getAll() {
    ensureSheet()
    return InventoryService.getMovements(null)
  }
  function getByProduct(productId) {
    ensureSheet()
    return InventoryService.getMovements(productId)
  }
  return { ensureSheet, getAll, getByProduct }
})()
