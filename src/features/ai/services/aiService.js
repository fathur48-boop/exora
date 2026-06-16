import apiClient from '../../../shared/lib/axios.js'
import { isSupabase } from '../../../shared/lib/crudAdapter.js'
import { buildBusinessContext } from '../../../shared/lib/aiContextBuilder.js'

const SYSTEM_PROMPT_PREFIX =
  'Anda adalah EXORA AI, asisten bisnis cerdas untuk platform Business Operating System EXORA. ' +
  'Anda memiliki akses ke data bisnis real-time pengguna (lihat di bawah). ' +
  'Jawab pertanyaan pengguna berdasarkan data ini secara akurat, ringkas, dan actionable. ' +
  'Gunakan Bahasa Indonesia yang profesional namun ramah. Berikan insight dan saran konkret bila relevan. ' +
  'Format angka dalam Rupiah (Rp) dengan pemisah ribuan. Gunakan markdown (bold, list) untuk keterbacaan.\n\n'

const GROQ_MODEL = 'llama-3.3-70b-versatile'

export async function sendChatMessage(messages) {
  if (isSupabase()) {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY
    if (!apiKey) throw new Error('VITE_GROQ_API_KEY belum diset. Tambahkan di .env.local untuk mengaktifkan AI Assistant pada mode Supabase.')

    const context = await buildBusinessContext()
    const systemPrompt = SYSTEM_PROMPT_PREFIX + context

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${apiKey}` },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        temperature: 0.4,
        max_tokens: 1500,
      }),
    })
    const body = await res.json()
    if (!res.ok) throw new Error(body?.error?.message || 'Groq API error')
    const reply = body?.choices?.[0]?.message?.content
    if (!reply) throw new Error('Respons AI kosong')
    return reply
  }

  const r = await apiClient.post('', { action: 'ai.chat', payload: { messages } })
  return r.data.data.reply
}
