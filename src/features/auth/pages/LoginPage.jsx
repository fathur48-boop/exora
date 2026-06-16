import AuthHeader from '../components/AuthHeader.jsx'
import LoginForm  from '../components/LoginForm.jsx'

export default function LoginPage() {
  return (
    <>
      <AuthHeader />
      <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/30">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white">Selamat datang kembali</h2>
          <p className="text-brand-300/70 text-sm mt-1">Masuk untuk melanjutkan ke workspace Anda</p>
        </div>
        <LoginForm />
      </div>
      <p className="text-center text-brand-400/60 text-xs mt-6">
        © {new Date().getFullYear()} EXORA Business OS · All rights reserved
      </p>
    </>
  )
}
