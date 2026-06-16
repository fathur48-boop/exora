var TransactionService = (function () {
  var SHEET = CONFIG.SHEETS.TRANSACTIONS
  var TYPES = ['income','expense']
  var STATUSES = ['paid','unpaid','partial']

  function getAll() {
    return SheetService.getAll(SHEET).sort(function(a,b){return new Date(b.date)-new Date(a.date)})
  }
  function getById(id) {
    var t = SheetService.findById(SHEET, id)
    if (!t) throw new Error('Transaction not found')
    return t
  }
  function create(data) {
    var now = new Date().toISOString()
    var t = {
      id: Utilities.getUuid(), type: data.type||'income', amount: parseFloat(data.amount)||0,
      category: data.category||'', description: data.description||'', reference: data.reference||'',
      payment_method: data.payment_method||'cash', status: data.status||'paid',
      contact_name: data.contact_name||'', date: data.date||now.slice(0,10),
      notes: data.notes||'', created_at: now, updated_at: now,
    }
    if (TYPES.indexOf(t.type)===-1) throw new Error('Tipe transaksi tidak valid')
    if (STATUSES.indexOf(t.status)===-1) throw new Error('Status tidak valid')
    if (!t.description.trim()) throw new Error('Deskripsi wajib diisi')
    if (t.amount<=0) throw new Error('Jumlah harus lebih dari 0')
    SheetService.insert(SHEET, t)
    return t
  }
  function update(id, data) {
    var ex = getById(id)
    var now = new Date().toISOString()
    var partial = {
      type: data.type!==undefined?data.type:ex.type,
      amount: data.amount!==undefined?parseFloat(data.amount)||0:ex.amount,
      category: data.category!==undefined?data.category:ex.category,
      description: data.description!==undefined?data.description:ex.description,
      reference: data.reference!==undefined?data.reference:ex.reference,
      payment_method: data.payment_method!==undefined?data.payment_method:ex.payment_method,
      status: data.status!==undefined?data.status:ex.status,
      contact_name: data.contact_name!==undefined?data.contact_name:ex.contact_name,
      date: data.date!==undefined?data.date:ex.date,
      notes: data.notes!==undefined?data.notes:ex.notes,
      updated_at: now,
    }
    SheetService.updateById(SHEET, id, partial)
    return Object.assign({}, ex, partial)
  }
  function remove(id) {
    getById(id)
    SheetService.deleteById(SHEET, id)
    return { ok: true }
  }

  function getSummary() {
    var all = getAll()
    var income  = all.filter(function(t){return t.type==='income'})
    var expense = all.filter(function(t){return t.type==='expense'})
    var totalIncome  = income.reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)
    var totalExpense = expense.reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)

    var now = new Date()
    var monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    var monthIncome  = income.filter(function(t){return new Date(t.date)>=monthStart}).reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)
    var monthExpense = expense.filter(function(t){return new Date(t.date)>=monthStart}).reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)

    var unpaidIncome  = income.filter(function(t){return t.status==='unpaid'}).reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)
    var unpaidExpense = expense.filter(function(t){return t.status==='unpaid'}).reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)

    // 6-month trend
    var trend = []
    for (var i=5;i>=0;i--) {
      var d = new Date(now.getFullYear(), now.getMonth()-i, 1)
      var y=d.getFullYear(), m=d.getMonth()
      var lbl = d.toLocaleString('id-ID',{month:'short',year:'2-digit'})
      var inc = income.filter(function(t){var td=new Date(t.date);return td.getFullYear()===y&&td.getMonth()===m}).reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)
      var exp = expense.filter(function(t){var td=new Date(t.date);return td.getFullYear()===y&&td.getMonth()===m}).reduce(function(s,t){return s+(parseFloat(t.amount)||0)},0)
      trend.push({ label: lbl, income: inc, expense: exp })
    }

    return {
      total_income: totalIncome, total_expense: totalExpense, net_profit: totalIncome-totalExpense,
      month_income: monthIncome, month_expense: monthExpense, month_profit: monthIncome-monthExpense,
      unpaid_income: unpaidIncome, unpaid_expense: unpaidExpense, trend: trend,
    }
  }

  return { getAll, getById, create, update, remove, getSummary }
})()
