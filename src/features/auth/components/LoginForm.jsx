import { useState } from 'react'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Input  from '../../../shared/components/ui/Input.jsx'
import Button from '../../../shared/components/ui/Button.jsx'
import Alert  from '../../../shared/components/ui/Alert.jsx'
import { useLogin } from '../hooks/useLogin.js'
import { isValidEmail } from '../utils/authHelpers.js'

export default function LoginForm() {
  const { login, isLoading, error } = useLogin()
  const [fields, setFields]             = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors]   = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFields(prev => ({ ...prev, [name]: value }))
    if (fieldErrors[name]) setFieldErrors(prev => ({ ...prev, [name]: null }))
  }

  const validate = () => {
    const errs = {}
    if (!fields.email.trim())       errs.email    = 'Email wajib diisi'
    else if (!isValidEmail(fields.email)) errs.email = 'Format email tidak valid'
    if (!fields.password)           errs.password = 'Password wajib diisi'
    else if (fields.password.length < 6) errs.password = 'Minimal 6 karakter'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setFieldErrors(errs); return }
    login({ email: fields.email.trim().toLowerCase(), password: fields.password })
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {error && <Alert type="error" message={error} />}

      <Input label="Email" name="email" type="email" autoComplete="email"
        placeholder="nama@perusahaan.com" value={fields.email}
        onChange={handleChange} error={fieldErrors.email} disabled={isLoading}
        leftElement={<Mail className="w-4 h-4" />}
      />

      <Input label="Password" name="password"
        type={showPassword ? 'text' : 'password'} autoComplete="current-password"
        placeholder="Masukkan password" value={fields.password}
        onChange={handleChange} error={fieldErrors.password} disabled={isLoading}
        leftElement={<Lock className="w-4 h-4" />}
        rightElement={
          <button type="button" onClick={() => setShowPassword(v => !v)}
            className="text-ink-faint hover:text-ink-muted transition-colors p-1"
            aria-label={showPassword ? 'Hide' : 'Show'}>
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        }
      />

      <Button type="submit" size="lg" loading={isLoading} className="w-full mt-2">
        {isLoading ? 'Masuk...' : 'Masuk ke EXORA'}
      </Button>
    </form>
  )
}
