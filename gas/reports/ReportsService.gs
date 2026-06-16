var ReportsService = (function () {

  function getFullReport() {
    return {
      revenue: getRevenueReport(), leads: getLeadsReport(), inventory: getInventoryReport(),
      hr: getHrReport(), projects: getProjectsReport(), generated_at: new Date().toISOString(),
    }
  }

  function getRevenueReport() {
    var transactions = SheetService.getAll(CONFIG.SHEETS.TRANSACTIONS)
    var now = new Date(), year = now.getFullYear(), month = now.getMonth()
    var income  = transactions.filter(function(t){return t.type==='income' && t.status!=='unpaid'})
    var expense = transactions.filter(function(t){return t.type==='expense' && t.status!=='unpaid'})
    var totalIncome  = income.reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)
    var totalExpense = expense.reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)
    var monthIncome  = income.filter(function(t){var d=new Date(t.date);return d.getFullYear()===year&&d.getMonth()===month}).reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)
    var monthExpense = expense.filter(function(t){var d=new Date(t.date);return d.getFullYear()===year&&d.getMonth()===month}).reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)
    var byCategory = {}
    income.forEach(function(t){var cat=t.category||'Other';byCategory[cat]=(byCategory[cat]||0)+(parseFloat(t.amount)||0)})
    var monthly = []
    for (var i=11;i>=0;i--) {
      var d=new Date(year,month-i,1), y=d.getFullYear(), m=d.getMonth()
      var lbl=d.toLocaleString('id-ID',{month:'short',year:'2-digit'})
      var inc=income.filter(function(t){var td=new Date(t.date);return td.getFullYear()===y&&td.getMonth()===m}).reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)
      var exp=expense.filter(function(t){var td=new Date(t.date);return td.getFullYear()===y&&td.getMonth()===m}).reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)
      monthly.push({ label: lbl, income: inc, expense: exp, profit: inc-exp })
    }
    return {
      total_income: totalIncome, total_expense: totalExpense, net_profit: totalIncome-totalExpense,
      month_income: monthIncome, month_expense: monthExpense, month_profit: monthIncome-monthExpense,
      profit_margin: totalIncome>0?Math.round(((totalIncome-totalExpense)/totalIncome)*100):0,
      by_category: byCategory, monthly_trend: monthly,
    }
  }

  function getLeadsReport() {
    var leads = SheetService.getAll(CONFIG.SHEETS.LEADS)
    var stages=['new','contacted','qualified','proposal','negotiation','closed','lost']
    var sources=['website','referral','social','cold_call','other']
    var byStage={}, bySource={}
    stages.forEach(function(s){byStage[s]=0}); sources.forEach(function(s){bySource[s]=0})
    var totalValue=0, closedValue=0
    leads.forEach(function(l){
      var s=(l.stage||'new').toLowerCase(), r=(l.source||'other').toLowerCase()
      if(byStage[s]!==undefined)byStage[s]++
      if(bySource[r]!==undefined)bySource[r]++
      totalValue += parseFloat(l.value)||0
      if(s==='closed') closedValue += parseFloat(l.value)||0
    })
    var conversionRate = leads.length>0 ? Math.round((byStage['closed']/leads.length)*100) : 0
    return { total: leads.length, by_stage: byStage, by_source: bySource, total_value: totalValue, closed_value: closedValue, conversion_rate: conversionRate }
  }

  function getInventoryReport() {
    var products = SheetService.getAll(CONFIG.SHEETS.PRODUCTS)
    var inventory = SheetService.getAll(CONFIG.SHEETS.INVENTORY)
    var totalValue=0, lowStock=0, outOfStock=0, byCategory={}
    inventory.forEach(function(inv){
      var product = products.find(function(p){return p.id===inv.product_id}) || {}
      var qty=parseFloat(inv.quantity)||0, minQty=parseFloat(inv.min_stock)||0, price=parseFloat(product.price)||0
      var cat=product.category||'Uncategorized'
      totalValue += qty*price
      if(qty===0) outOfStock++
      else if(qty<=minQty && minQty>0) lowStock++
      byCategory[cat]=(byCategory[cat]||0)+qty
    })
    return { total_products: products.length, total_value: totalValue, low_stock: lowStock, out_of_stock: outOfStock, by_category: byCategory }
  }

  function getHrReport() {
    var employees = SheetService.getAll(CONFIG.SHEETS.EMPLOYEES)
    var active = employees.filter(function(e){return e.status==='active'})
    var byDept={}
    employees.forEach(function(e){var d=e.department||'Uncategorized';byDept[d]=(byDept[d]||0)+1})
    var totalSalary = active.reduce(function(s,e){return s+(parseFloat(e.salary)||0)},0)
    var avgSalary = active.length?Math.round(totalSalary/active.length):0
    return { total: employees.length, active: active.length, total_salary: totalSalary, avg_salary: avgSalary, by_department: byDept }
  }

  function getProjectsReport() {
    var projects = SheetService.getAll(CONFIG.SHEETS.PROJECTS)
    var byStatus={}, totalBudget=0, totalSpent=0, overdue=0, now=new Date()
    projects.forEach(function(p){
      var s=p.status||'planning'
      byStatus[s]=(byStatus[s]||0)+1
      totalBudget += parseFloat(p.budget)||0
      totalSpent  += parseFloat(p.spent)||0
      if(p.end_date && new Date(p.end_date)<now && s!=='completed' && s!=='cancelled') overdue++
    })
    return {
      total: projects.length, by_status: byStatus, total_budget: totalBudget, total_spent: totalSpent,
      budget_usage: totalBudget>0?Math.round((totalSpent/totalBudget)*100):0, overdue: overdue,
    }
  }

  return { getFullReport, getRevenueReport, getLeadsReport, getInventoryReport, getHrReport, getProjectsReport }
})()
