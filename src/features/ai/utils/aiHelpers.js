export const QUICK_PROMPTS = [
  { label:'Ringkasan bisnis',   prompt:'Berikan ringkasan kondisi bisnis saya saat ini secara lengkap.' },
  { label:'Status leads',       prompt:'Bagaimana status pipeline leads saya? Mana yang perlu difollow up?' },
  { label:'Analisis revenue',   prompt:'Analisis revenue bisnis saya dan berikan insight penting.' },
  { label:'Customer terbaru',   prompt:'Siapa saja customer terbaru dan apa yang perlu saya perhatikan?' },
  { label:'Performa proyek',    prompt:'Bagaimana status proyek-proyek aktif saya?' },
  { label:'Saran pertumbuhan',  prompt:'Berikan saran konkret untuk mengembangkan bisnis saya.' },
]
export function formatMessageTime(isoString) {
  return new Date(isoString).toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })
}
export function buildUserMessage(content) {
  return { id:crypto.randomUUID(), role:'user', content:content.trim(), timestamp:new Date().toISOString() }
}
export function buildAssistantMessage(content) {
  return { id:crypto.randomUUID(), role:'assistant', content, timestamp:new Date().toISOString() }
}
export function buildErrorMessage(errorText) {
  return { id:crypto.randomUUID(), role:'assistant', content:errorText, timestamp:new Date().toISOString(), isError:true }
}
export function toGroqMessages(messages) {
  return messages.map(m => ({ role:m.role, content:m.content }))
}
