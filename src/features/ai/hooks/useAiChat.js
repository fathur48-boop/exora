import { useCallback } from 'react'
import { useAiStore } from '../store/aiStore.js'
import { sendChatMessage } from '../services/aiService.js'
import { buildUserMessage, buildAssistantMessage, buildErrorMessage, toGroqMessages } from '../utils/aiHelpers.js'
export function useAiChat() {
  const { messages, isLoading, error, addMessage, setLoading, clearError, clearChat } = useAiStore()
  const send = useCallback(async (content) => {
    if (!content.trim() || isLoading) return
    clearError()
    const userMsg = buildUserMessage(content)
    addMessage(userMsg)
    setLoading(true)
    try {
      const history = [...messages, userMsg]
      const groqMsgs = toGroqMessages(history.filter(m => m.id !== 'welcome'))
      const reply = await sendChatMessage(groqMsgs)
      addMessage(buildAssistantMessage(reply))
    } catch (err) {
      addMessage(buildErrorMessage('Maaf, terjadi kesalahan: ' + (err.message || 'Tidak dapat terhubung ke AI.')))
    } finally { setLoading(false) }
  }, [messages, isLoading, addMessage, setLoading, clearError])
  return { messages, isLoading, error, send, clearChat }
}
