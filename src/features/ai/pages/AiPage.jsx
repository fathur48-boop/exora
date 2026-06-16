import { Trash2 }    from 'lucide-react'
import ChatWindow    from '../components/ChatWindow.jsx'
import ChatInput     from '../components/ChatInput.jsx'
import QuickPrompts  from '../components/QuickPrompts.jsx'
import Topbar        from '../../../shared/components/ui/Topbar.jsx'
import Button        from '../../../shared/components/ui/Button.jsx'
import { useAiChat } from '../hooks/useAiChat.js'
export default function AiPage() {
  const { messages, isLoading, send, clearChat } = useAiChat()
  return (
    <div className="flex flex-col h-screen">
      <Topbar title="AI Assistant" subtitle="Powered by Groq · Data bisnis real-time"/>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 flex flex-col max-w-3xl w-full mx-auto bg-white border-x border-surface-border min-h-0 shadow-panel">
          <div className="flex items-center justify-between px-4 py-2.5 border-b border-surface-border shrink-0 bg-surface-muted/30">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse-slow"/>
              <span className="text-xs text-ink-muted font-medium">EXORA AI · {messages.length-1} pesan</span>
            </div>
            <Button variant="ghost" size="sm" leftIcon={<Trash2 className="w-3.5 h-3.5"/>} onClick={clearChat} disabled={isLoading}>
              Bersihkan
            </Button>
          </div>
          <ChatWindow messages={messages} isLoading={isLoading}/>
          <QuickPrompts onSelect={send} disabled={isLoading}/>
          <ChatInput onSend={send} disabled={isLoading}/>
        </div>
      </div>
    </div>
  )
}
