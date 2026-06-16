import { useState, useRef } from 'react'
import { Send } from 'lucide-react'
import { cn } from '../../../shared/utils/cn.js'
export default function ChatInput({ onSend, disabled }) {
  const [value,setValue] = useState('')
  const textareaRef = useRef(null)
  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed); setValue('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
  }
  const handleKeyDown = (e) => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }
  const handleChange  = (e) => {
    setValue(e.target.value)
    const el = textareaRef.current
    if (el) { el.style.height='auto'; el.style.height=Math.min(el.scrollHeight,120)+'px' }
  }
  return (
    <div className="px-4 py-3 border-t border-surface-border bg-white">
      <div className="flex items-end gap-3">
        <textarea ref={textareaRef} value={value} onChange={handleChange} onKeyDown={handleKeyDown}
          disabled={disabled} placeholder="Tanyakan sesuatu tentang bisnis Anda… (Enter untuk kirim)" rows={1}
          className={cn(
            'flex-1 resize-none rounded-xl border border-surface-border bg-surface-muted px-4 py-2.5',
            'text-sm text-ink placeholder:text-ink-faint',
            'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400 hover:border-brand-300',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            'min-h-[40px] max-h-[120px] leading-relaxed transition-all'
          )}/>
        <button onClick={handleSend} disabled={disabled || !value.trim()}
          className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-150',
            'disabled:opacity-40 disabled:cursor-not-allowed',
            value.trim() && !disabled ? 'bg-gradient-to-br from-brand-600 to-violet-600 text-white shadow-sm hover:shadow-md' : 'bg-surface-subtle text-ink-faint'
          )}>
          <Send className="w-4 h-4"/>
        </button>
      </div>
      <p className="text-2xs text-ink-faint mt-1.5 text-center">Enter kirim · Shift+Enter baris baru</p>
    </div>
  )
}
