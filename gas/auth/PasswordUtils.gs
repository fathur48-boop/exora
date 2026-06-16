var PasswordUtils = (function () {
  function generateSalt() {
    return Utilities.getUuid().replace(/-/g, '')
  }
  function hash(password, salt) {
    var raw = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, password + salt)
    return raw.map(function (b) { return (b < 0 ? b + 256 : b).toString(16).padStart(2, '0') }).join('')
  }
  function verify(password, salt, hashValue) {
    return hash(password, salt) === hashValue
  }
  return { generateSalt, hash, verify }
})()
