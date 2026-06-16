import { cn } from '../../../shared/utils/cn.js'
import { AlertCircle } from 'lucide-react'
import { formatMessageTime } from '../utils/aiHelpers.js'

function parseMarkdown(text) {
  return text
    .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.*?)\*/g,'<em>$1</em>')
    .replace(/`([^`]+)`/g,'<code class="bg-surface-subtle px-1.5 py-0.5 rounded-md text-xs font-mono text-brand-700">$1</code>')
    .replace(/\n/g,'<br/>')
}

export default function ChatMessage({ message }) {
  const isUser = message.role === 'user'
  const isError = message.isError
  if (isUser) return (
    <div className="flex items-start justify-end gap-3 px-4 py-2">
      <div className="max-w-[75%]">
        <div className="bg-gradient-to-br from-brand-600 to-violet-600 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 shadow-sm">
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
        <p className="text-2xs text-ink-faint mt-1 text-right">{formatMessageTime(message.timestamp)}</p>
      </div>
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-100 to-brand-200 flex items-center justify-center shrink-0 text-brand-700 text-xs font-bold">U</div>
    </div>
  )
  return (
    <div className="flex items-start gap-3 px-4 py-2">
      <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm',
        isError ? 'bg-red-100' : 'bg-gradient-to-br from-brand-500 to-violet-600')}>
        {isError ? <AlertCircle className="w-4 h-4 text-red-500"/> :
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>}
      </div>
      <div className="max-w-[75%]">
        <div className={cn('rounded-2xl rounded-tl-sm px-4 py-2.5 shadow-card',
          isError ? 'bg-red-50 border border-red-200' : 'bg-white border border-surface-border')}>
          <p className={cn('text-sm leading-relaxed', isError ? 'text-red-700' : 'text-ink')}
            dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}/>
        </div>
        <p className="text-2xs text-ink-faint mt-1">{formatMessageTime(message.timestamp)}</p>
      </div>
    </div>
  )
}
