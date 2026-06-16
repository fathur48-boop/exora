import { useEffect, useRef } from 'react'
import ChatMessage     from './ChatMessage.jsx'
import TypingIndicator from './TypingIndicator.jsx'
export default function ChatWindow({ messages, isLoading }) {
  const bottomRef = useRef(null)
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages, isLoading])
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin py-4 bg-surface-muted/30">
      {messages.map(m => <ChatMessage key={m.id} message={m}/>)}
      {isLoading && <TypingIndicator/>}
      <div ref={bottomRef}/>
    </div>
  )
}
