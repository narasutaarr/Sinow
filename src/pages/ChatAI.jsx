import { useEffect, useRef, useState } from 'react'
import { askAI } from '../lib/ai.js'

const KEY = 'sinow-chat-v1'
const GREETING = [{ id: 'g', role: 'assistant', content: 'Halo! Aku Sinow AI. Ada materi yang mau kamu tanyakan?' }]
const uid = () => Math.random().toString(36).slice(2, 9)

const load = () => {
  try {
    const m = JSON.parse(localStorage.getItem(KEY))
    return m?.length ? m : GREETING
  } catch {
    return GREETING
  }
}

export default function ChatAI() {
  const [messages, setMessages] = useState(load)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const endRef = useRef(null)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(messages)) } catch { /* abaikan */ }
  }, [messages])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async () => {
    const content = text.trim()
    if (!content || loading) return
    const next = [...messages, { id: uid(), role: 'user', content }]
    setMessages(next)
    setText('')
    setError('')
    setLoading(true)
    try {
      // sapaan awal tidak dikirim ke AI
      const history = next.filter(m => m.id !== 'g').map(({ role, content }) => ({ role, content }))
      const reply = await askAI(history)
      setMessages(m => [...m, { id: uid(), role: 'assistant', content: reply }])
    } catch (err) {
      console.error(err)
      setError('Gagal menghubungi AI. Coba Kirim lagi.')
    } finally {
      setLoading(false)
    }
  }

  const onKey = e => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() }
  }

  const clear = () => {
    if (confirm('Hapus semua percakapan?')) setMessages(GREETING)
  }

  return (
    <section className="mx-auto mt-5 flex h-[calc(100dvh-15rem)] min-h-[26rem] max-w-4xl flex-col overflow-hidden rounded-md border border-black/70 bg-[#d9d9d9] sm:mt-6">
      <div className="flex items-center justify-between bg-white px-4 py-4 shadow-md">
        <span className="w-20" />
        <h2 className="text-center text-lg tracking-wide sm:text-xl">SINOW AI</h2>
        <button onClick={clear} className="w-20 text-right text-xs underline">Hapus chat</button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto px-4 py-5 sm:px-6" aria-live="polite">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <p className={`max-w-[80%] whitespace-pre-wrap break-words rounded-2xl px-4 py-3 text-sm leading-relaxed sm:text-base ${
              m.role === 'user' ? 'bg-mint' : 'bg-[#368cfb] text-white'}`}>
              {m.content}
            </p>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start" aria-label="AI sedang mengetik">
            <div className="flex gap-1.5 rounded-2xl bg-[#368cfb] px-4 py-4">
              {[0, 150, 300].map(d => (
                <span key={d} className="size-2 animate-bounce rounded-full bg-white/90" style={{ animationDelay: `${d}ms` }} />
              ))}
            </div>
          </div>
        )}

        {error && <p role="alert" className="text-center text-xs text-[#c0392b]">{error}</p>}
        <div ref={endRef} />
      </div>

      <form onSubmit={e => { e.preventDefault(); send() }} className="p-3 sm:p-4">
        <div className="flex items-end gap-3 rounded-xl bg-white px-4 py-2.5 shadow-card">
          <textarea rows={1} value={text} onChange={e => setText(e.target.value)} onKeyDown={onKey}
            placeholder="Tulis pertanyaanmu..."
            className="field-sizing-content max-h-32 min-h-7 flex-1 resize-none bg-transparent py-0.5 text-base outline-none" />
          <button type="submit" disabled={!text.trim() || loading} aria-label="Kirim"
            className="shrink-0 pb-0.5 transition-opacity disabled:opacity-40">
            <svg viewBox="0 0 24 24" className="size-7" aria-hidden="true"><path d="M5 3l16 9-16 9z" fill="#6db38a" /></svg>
          </button>
        </div>
      </form>
    </section>
  )
}