import { api } from './api.js'

export async function askAI(history) {
  const data = await api('/api/ai/chat', {
    method: 'POST',
    body: {
      messages: history,
      message: history[history.length - 1].content,   // teks terakhir saja
    },
  })
  return data.reply ?? data.answer ?? data.message ?? data.response   // coba beberapa nama field
}