var DashboardService = (function () {

  function getSummary() {
    var customers = SheetService.getAll(CONFIG.SHEETS.CUSTOMERS)
    var leads     = SheetService.getAll(CONFIG.SHEETS.LEADS)
    var products  = SheetService.getAll(CONFIG.SHEETS.PRODUCTS)
    var txns      = SheetService.getAll(CONFIG.SHEETS.TRANSACTIONS)
    var projects  = SheetService.getAll(CONFIG.SHEETS.PROJECTS)
    var employees = SheetService.getAll(CONFIG.SHEETS.EMPLOYEES)

    var income = txns.filter(function(t){ return t.type==='income' && t.status!=='unpaid' })
    var totalRevenue = income.reduce(function(s,t){ return s+(parseFloat(t.amount)||0) },0)

    var now = new Date()
    var monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    var recentRevenue = income.filter(function(t){ return new Date(t.date) >= monthStart })
      .reduce(function(s,t){ return s+(parseFloat(t.amount)||0) },0)

    var activeLeads = leads.filter(function(l){ return l.stage!=='closed' && l.stage!=='lost' }).length
    var activeProjects = projects.filter(function(p){ return p.status==='active' }).length

    var stats = {
      total_customers: customers.length,
      total_revenue: totalRevenue,
      recent_revenue: recentRevenue,
      active_leads: activeLeads,
      total_leads: leads.length,
      total_products: products.length,
      active_projects: activeProjects,
      total_projects: projects.length,
      total_employees: employees.filter(function(e){return e.status==='active'}).length,
    }

    // Revenue trend - last 7 days
    var revenueTrend = []
    for (var i=6;i>=0;i--) {
      var d = new Date(); d.setDate(d.getDate()-i)
      var dayStr = d.toISOString().slice(0,10)
      var dayTotal = income.filter(function(t){ return (t.date||'').slice(0,10)===dayStr })
        .reduce(function(s,t){ return s+(parseFloat(t.amount)||0) },0)
      revenueTrend.push({ label: d.toLocaleDateString('id-ID',{weekday:'short'}), value: dayTotal })
    }

    // Leads pipeline by stage
    var stageLabels = { new:'New', contacted:'Contacted', qualified:'Qualified', proposal:'Proposal', negotiation:'Negotiation', closed:'Closed', lost:'Lost' }
    var stageCounts = {}
    Object.keys(stageLabels).forEach(function(s){ stageCounts[s]=0 })
    leads.forEach(function(l){ var s=(l.stage||'new').toLowerCase(); if(stageCounts[s]!==undefined) stageCounts[s]++ })
    var leadsPipeline = Object.keys(stageLabels).map(function(s){ return { label: stageLabels[s], value: stageCounts[s] } })

    return { stats: stats, revenue_trend: revenueTrend, leads_pipeline: leadsPipeline }
  }

  return { getSummary }
})()
