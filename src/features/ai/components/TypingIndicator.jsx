export default function TypingIndicator() {
  return (
    <div className="flex items-start gap-3 px-4 py-3">
      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-brand-500 to-violet-600 flex items-center justify-center shrink-0 shadow-sm">
        <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
      </div>
      <div className="bg-white border border-surface-border rounded-2xl rounded-tl-sm px-4 py-3 shadow-card">
        <div className="flex items-center gap-1.5 h-5">
          {[0,1,2].map(i=>(
            <span key={i} className="w-2 h-2 rounded-full bg-brand-400 animate-bounce"
              style={{ animationDelay:`${i*150}ms`, animationDuration:'900ms' }}/>
          ))}
        </div>
      </div>
    </div>
  )
}
