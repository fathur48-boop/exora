var SettingsController = (function () {
  function requireSession(token) {
    if (!token) throw new Error('Unauthorized')
    var s = SessionManager.validate(token)
    if (!s) throw new Error('Session expired or invalid')
    return s
  }
  function requireAdmin(token) {
    var s = requireSession(token)
    if (s.role!=='super_admin' && s.role!=='owner') throw new Error('Insufficient permissions')
    return s
  }

  function getSettings(p,t)    { try { requireSession(t); return successResponse(SettingsService.getAll()) } catch(e){return errorResponse(e.message)} }
  function updateSettings(p,t) { try { requireAdmin(t); return successResponse(SettingsService.setMany(p.settings),'Settings saved') } catch(e){return errorResponse(e.message)} }

  function getUsers(p,t) {
    try {
      requireAdmin(t)
      var users = SheetService.getAll(CONFIG.SHEETS.USERS).map(function(u){
        return { id:u.id, email:u.email, full_name:u.full_name, role:u.role, is_active:u.is_active, last_login_at:u.last_login_at||null, created_at:u.created_at }
      })
      return successResponse(users)
    } catch(e) { return errorResponse(e.message) }
  }

  function createUser(p,t) {
    try {
      requireAdmin(t)
      var existing = SheetService.findByField(CONFIG.SHEETS.USERS, 'email', p.email)
      if (existing) throw new Error('Email already registered')
      var salt = PasswordUtils.generateSalt()
      var hash = PasswordUtils.hash(p.password, salt)
      var now = new Date().toISOString()
      var user = {
        id: Utilities.getUuid(), email:(p.email||'').trim().toLowerCase(), password_hash: hash, password_salt: salt,
        full_name: p.full_name||'', role: p.role||'staff', is_active: true, avatar_url: '',
        last_login_at: '', created_at: now, updated_at: now,
      }
      if (!user.email) throw new Error('Email is required')
      if (!p.password) throw new Error('Password is required')
      if (!user.full_name) throw new Error('Full name is required')
      SheetService.insert(CONFIG.SHEETS.USERS, user)
      return successResponse({ id:user.id, email:user.email, full_name:user.full_name, role:user.role, is_active:user.is_active, created_at:user.created_at }, 'User created')
    } catch(e) { return errorResponse(e.message) }
  }

  function updateUser(p,t) {
    try {
      requireAdmin(t)
      var user = SheetService.findById(CONFIG.SHEETS.USERS, p.id)
      if (!user) throw new Error('User not found')
      var partial = { updated_at: new Date().toISOString() }
      if (p.full_name!==undefined) partial.full_name = p.full_name
      if (p.role!==undefined) partial.role = p.role
      if (p.is_active!==undefined) partial.is_active = p.is_active
      if (p.password && p.password.trim()) {
        var salt = PasswordUtils.generateSalt()
        partial.password_hash = PasswordUtils.hash(p.password, salt)
        partial.password_salt = salt
      }
      SheetService.updateById(CONFIG.SHEETS.USERS, p.id, partial)
      return successResponse({ id:user.id, email:user.email, full_name: partial.full_name??user.full_name, role: partial.role??user.role, is_active: partial.is_active??user.is_active }, 'User updated')
    } catch(e) { return errorResponse(e.message) }
  }

  function deleteUser(p,t) {
    try {
      var session = requireAdmin(t)
      if (p.id===session.user_id) throw new Error('Cannot delete your own account')
      var user = SheetService.findById(CONFIG.SHEETS.USERS, p.id)
      if (!user) throw new Error('User not found')
      SheetService.deleteById(CONFIG.SHEETS.USERS, p.id)
      return successResponse({ ok: true }, 'User deleted')
    } catch(e) { return errorResponse(e.message) }
  }

  return { getSettings, updateSettings, getUsers, createUser, updateUser, deleteUser }
})()
