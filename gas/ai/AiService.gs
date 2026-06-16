var AiService = (function () {

  var SYSTEM_PROMPT_TEMPLATE =
    'Anda adalah EXORA AI, asisten bisnis cerdas untuk platform Business Operating System EXORA. ' +
    'Anda memiliki akses ke data bisnis real-time pengguna (lihat di bawah). ' +
    'Jawab pertanyaan pengguna berdasarkan data ini secara akurat, ringkas, dan actionable. ' +
    'Gunakan Bahasa Indonesia yang profesional namun ramah. Berikan insight dan saran konkret bila relevan. ' +
    'Format angka dalam Rupiah (Rp) dengan pemisah ribuan. Gunakan markdown (bold, list) untuk keterbacaan.\n\n'

  function chat(messages) {
    var apiKey = getGroqApiKey()
    if (!apiKey) throw new Error('GROQ_API_KEY belum dikonfigurasi di Script Properties')

    var businessContext = ContextBuilder.build()
    var systemPrompt = SYSTEM_PROMPT_TEMPLATE + businessContext

    var payload = {
      model: CONFIG.GROQ_MODEL,
      messages: [{ role:'system', content: systemPrompt }].concat(messages),
      temperature: 0.4,
      max_tokens: 1500,
    }

    var response = UrlFetchApp.fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'post',
      contentType: 'application/json',
      headers: { 'Authorization': 'Bearer ' + apiKey },
      payload: JSON.stringify(payload),
      muteHttpExceptions: true,
    })

    var code = response.getResponseCode()
    var body = JSON.parse(response.getContentText())

    if (code !== 200) {
      throw new Error('Groq API error: ' + (body.error && body.error.message ? body.error.message : 'Unknown error'))
    }

    var reply = body.choices && body.choices[0] && body.choices[0].message && body.choices[0].message.content
    if (!reply) throw new Error('Respons AI kosong')

    return { reply: reply }
  }

  return { chat }
})()
