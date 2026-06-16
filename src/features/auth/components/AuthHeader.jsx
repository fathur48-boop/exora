export default function AuthHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-brand-500 to-violet-600 rounded-2xl mb-5 shadow-xl shadow-brand-900/40">
        <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z"/>
          <path d="M2 17l10 5 10-5"/>
          <path d="M2 12l10 5 10-5"/>
        </svg>
      </div>
      <h1 className="text-3xl font-extrabold text-white tracking-tight">EXORA</h1>
      <p className="text-brand-300/80 text-sm mt-1.5 font-medium">Business Operating System</p>
    </div>
  )
}
