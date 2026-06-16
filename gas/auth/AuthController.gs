var AuthController = (function () {
  function login(p) {
    try {
      if (!p.email || !p.password) throw new Error('Email dan password wajib diisi')
      return successResponse(AuthService.login(p.email, p.password), 'Login successful')
    } catch (e) { return errorResponse(e.message) }
  }
  function validateSession(p) {
    try { return successResponse(AuthService.validateSession(p.token)) }
    catch (e) { return errorResponse(e.message) }
  }
  function logout(p) {
    try { return successResponse(AuthService.logout(p.token), 'Logged out') }
    catch (e) { return errorResponse(e.message) }
  }
  return { login, validateSession, logout }
})()
