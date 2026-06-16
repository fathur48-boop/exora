var ContextBuilder = (function () {

  function build() {
    var customers = SheetService.getAll(CONFIG.SHEETS.CUSTOMERS)
    var leads     = SheetService.getAll(CONFIG.SHEETS.LEADS)
    var products  = SheetService.getAll(CONFIG.SHEETS.PRODUCTS)
    var inventory = SheetService.getAll(CONFIG.SHEETS.INVENTORY)
    var txns      = SheetService.getAll(CONFIG.SHEETS.TRANSACTIONS)
    var projects  = SheetService.getAll(CONFIG.SHEETS.PROJECTS)
    var employees = SheetService.getAll(CONFIG.SHEETS.EMPLOYEES)

    var income  = txns.filter(function(t){return t.type==='income'})
    var expense = txns.filter(function(t){return t.type==='expense'})
    var totalIncome  = income.reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)
    var totalExpense = expense.reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)

    var lowStock = inventory.filter(function(i){
      var qty=parseFloat(i.quantity)||0, min=parseFloat(i.min_stock)||0
      return min>0 && qty<=min
    })

    var activeProjects = projects.filter(function(p){return p.status==='active'})
    var overdueProjects = projects.filter(function(p){
      return p.end_date && new Date(p.end_date)<new Date() && p.status!=='completed' && p.status!=='cancelled'
    })

    var leadsByStage = {}
    leads.forEach(function(l){ var s=l.stage||'new'; leadsByStage[s]=(leadsByStage[s]||0)+1 })

    var context = []
    context.push('=== DATA BISNIS EXORA (REAL-TIME) ===')
    context.push('')
    context.push('RINGKASAN KEUANGAN:')
    context.push('- Total Income: Rp ' + totalIncome.toLocaleString('id-ID'))
    context.push('- Total Expense: Rp ' + totalExpense.toLocaleString('id-ID'))
    context.push('- Net Profit: Rp ' + (totalIncome-totalExpense).toLocaleString('id-ID'))
    context.push('')
    context.push('CRM:')
    context.push('- Total Customers: ' + customers.length)
    context.push('- Total Leads: ' + leads.length)
    context.push('- Leads by stage: ' + JSON.stringify(leadsByStage))
    context.push('')
    context.push('INVENTORY:')
    context.push('- Total Produk: ' + products.length)
    context.push('- Produk stok menipis: ' + lowStock.length)
    if (lowStock.length>0) {
      context.push('  Detail: ' + lowStock.slice(0,5).map(function(i){
        var p = products.find(function(pp){return pp.id===i.product_id})
        return (p?p.name:i.product_id)+' (sisa '+i.quantity+')'
      }).join(', '))
    }
    context.push('')
    context.push('PROJECTS:')
    context.push('- Total Projects: ' + projects.length)
    context.push('- Active Projects: ' + activeProjects.length)
    context.push('- Overdue Projects: ' + overdueProjects.length)
    if (overdueProjects.length>0) {
      context.push('  Detail: ' + overdueProjects.slice(0,5).map(function(p){return p.name}).join(', '))
    }
    context.push('')
    context.push('HR:')
    context.push('- Total Karyawan: ' + employees.length)
    context.push('- Karyawan Aktif: ' + employees.filter(function(e){return e.status==='active'}).length)
    context.push('')
    context.push('=== AKHIR DATA BISNIS ===')

    return context.join('\n')
  }

  return { build }
})()
