function setupAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheets = {
    Users: ['id','email','password_hash','password_salt','full_name','role','is_active','avatar_url','last_login_at','created_at','updated_at'],
    Customers: ['id','name','email','phone','company','address','status','notes','created_at','updated_at'],
    Leads: ['id','name','email','phone','company','source','stage','value','notes','created_at','updated_at'],
    Activities: ['id','entity_type','entity_id','type','description','created_at'],
    Products: ['id','name','sku','category','description','price','cost','unit','is_active','created_at','updated_at'],
    Inventory: ['product_id','quantity','min_stock','location','updated_at'],
    Transactions: ['id','type','amount','category','description','reference','payment_method','status','contact_name','date','notes','created_at','updated_at'],
    Projects: ['id','name','description','status','priority','client_name','client_id','budget','spent','start_date','end_date','created_by','created_at','updated_at'],
    Tasks: ['id','project_id','title','description','status','priority','assigned_to','assigned_name','due_date','created_at','updated_at'],
    Employees: ['id','full_name','email','phone','role','department','status','salary','join_date','birth_date','address','emergency_contact','notes','created_at','updated_at'],
    Attendance: ['id','employee_id','date','status','check_in','check_out','notes','created_at'],
    LeaveRequests: ['id','employee_id','type','start_date','end_date','reason','status','approved_by','created_at','updated_at'],
    Settings: ['id','key','value','created_at','updated_at'],
    StockMovements: ['id','product_id','type','quantity','reference','notes','created_at'],
    Sessions: ['token','user_id','role','created_at','expires_at'],
  }

  Object.keys(sheets).forEach(function (name) {
    var sheet = ss.getSheetByName(name)
    if (!sheet) sheet = ss.insertSheet(name)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(sheets[name])
      sheet.getRange(1, 1, 1, sheets[name].length).setFontWeight('bold')
    }
  })

  Logger.log('All sheets created successfully')
}

function createSuperAdmin() {
  var email = 'admin@exora.com'
  var password = 'admin123'
  var existing = SheetService.findByField(CONFIG.SHEETS.USERS, 'email', email)
  if (existing) { Logger.log('Super admin already exists'); return }

  var salt = PasswordUtils.generateSalt()
  var hash = PasswordUtils.hash(password, salt)
  var now = new Date().toISOString()

  SheetService.insert(CONFIG.SHEETS.USERS, {
    id: Utilities.getUuid(),
    email: email,
    password_hash: hash,
    password_salt: salt,
    full_name: 'Super Admin',
    role: 'super_admin',
    is_active: true,
    avatar_url: '',
    last_login_at: '',
    created_at: now,
    updated_at: now,
  })

  Logger.log('Super admin created: ' + email + ' / ' + password)
}
