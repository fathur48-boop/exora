var AuthService = (function () {

  function login(email, password) {
    var user = SheetService.findByField(CONFIG.SHEETS.USERS, 'email', (email||'').trim().toLowerCase())
    if (!user) throw new Error('Email atau password salah')
    if (user.is_active === false || user.is_active === 'FALSE') throw new Error('Akun ini tidak aktif')

    if (!PasswordUtils.verify(password, user.password_salt, user.password_hash)) {
      throw new Error('Email atau password salah')
    }

    SheetService.updateById(CONFIG.SHEETS.USERS, user.id, { last_login_at: new Date().toISOString() })

    var token = SessionManager.create(user)
    return {
      token: token,
      user: {
        id: user.id, email: user.email, full_name: user.full_name,
        role: user.role, avatar_url: user.avatar_url || '',
      },
    }
  }

  function validateSession(token) {
    var session = SessionManager.validate(token)
    if (!session) throw new Error('Session expired or invalid')
    var user = SheetService.findById(CONFIG.SHEETS.USERS, session.user_id)
    if (!user) throw new Error('User not found')
    return {
      user: {
        id: user.id, email: user.email, full_name: user.full_name,
        role: user.role, avatar_url: user.avatar_url || '',
      },
    }
  }

  function logout(token) {
    SessionManager.destroy(token)
    return { ok: true }
  }

  return { login, validateSession, logout }
})()
