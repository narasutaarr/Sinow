import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import { useStore } from '../store.jsx'

const field = 'w-full rounded-xl border border-black/20 bg-white px-4 py-2.5 text-sm outline-none focus:border-[#5b4b8a]'

function MateriForm({ initial, onSubmit, onCancel }) {
  const [f, setF] = useState(initial ?? { title: '', content: '', link: '' })
  const set = k => e => setF({ ...f, [k]: e.target.value })
  const submit = e => {
    e.preventDefault()
    if (!f.title.trim()) return
    onSubmit({ title: f.title.trim(), content: f.content.trim(), link: f.link.trim() })
  }
  return (
    <form onSubmit={submit} className="mt-6 space-y-4 rounded-2xl bg-panel p-5 sm:p-6">
      <label className="block text-sm font-semibold">Judul materi
        <input className={`${field} mt-1.5 font-normal`} value={f.title} onChange={set('title')} placeholder="Contoh: Bilangan bulat" required />
      </label>
      <label className="block text-sm font-semibold">Isi materi
        <textarea className={`${field} mt-1.5 min-h-32 font-normal`} value={f.content} onChange={set('content')} placeholder="Tulis penjelasan materi di sini" />
      </label>
      <label className="block text-sm font-semibold">Tautan (video atau PDF, opsional)
        <input className={`${field} mt-1.5 font-normal`} type="url" value={f.link} onChange={set('link')} placeholder="https://" />
      </label>
      <div className="flex gap-3">
        <button className="rounded-full bg-mint px-5 py-2.5 text-sm font-semibold">Simpan materi</button>
        <button type="button" onClick={onCancel} className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold">Batal</button>
      </div>
    </form>
  )
}

export default function BabDetail() {
  const { babId } = useParams()
  const { chapters, addMateri, editMateri, removeMateri, toggleDone } = useStore()
  const bab = chapters.find(c => c.id === babId)
  const [mode, setMode] = useState(null) // null | 'new' | id materi yang diedit

  if (!bab) {
    return (
      <div className="py-20 text-center">
        <p className="text-black/60">Bab tidak ditemukan.</p>
        <Link to="/materi" className="mt-4 inline-block rounded-full bg-lilac px-5 py-2.5 text-sm font-semibold">Kembali ke Materi</Link>
      </div>
    )
  }

  const done = bab.materi.filter(m => m.done).length

  return (
    <div className="mx-auto max-w-3xl">
      <Link to="/materi" className="mt-5 inline-flex items-center gap-1 text-sm font-semibold sm:mt-6">
        <Icon name="back" className="size-5" /> Semua bab
      </Link>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-black/60">{bab.bab}</p>
          <h2 className="text-2xl font-semibold">{bab.title}</h2>
          <p className="mt-1 text-xs text-black/60">{done} dari {bab.materi.length} materi selesai</p>
        </div>
        {mode === null && (
          <button onClick={() => setMode('new')}
            className="flex items-center gap-1.5 rounded-full bg-mint px-5 py-2.5 text-sm font-semibold">
            <Icon name="plus" className="size-5" /> Tambah materi
          </button>
        )}
      </div>

      {mode === 'new' && (
        <MateriForm onCancel={() => setMode(null)}
          onSubmit={m => { addMateri(bab.id, m); setMode(null) }} />
      )}

      <ul className="mt-6 space-y-3">
        {bab.materi.length === 0 && mode !== 'new' && (
          <li className="rounded-2xl bg-lilac/50 px-6 py-10 text-center text-sm">
            Belum ada materi di bab ini. Klik “Tambah materi” untuk mulai.
          </li>
        )}
        {bab.materi.map(m => (
          <li key={m.id} className="rounded-2xl bg-lilac px-5 py-4 shadow-card">
            {mode === m.id ? (
              <MateriForm initial={m} onCancel={() => setMode(null)}
                onSubmit={v => { editMateri(bab.id, m.id, v); setMode(null) }} />
            ) : (
              <details>
                <summary className="flex cursor-pointer list-none items-center gap-3">
                  <input type="checkbox" checked={m.done} onClick={e => e.stopPropagation()}
                    onChange={() => toggleDone(bab.id, m.id)} aria-label={`Tandai ${m.title} selesai`}
                    className="size-5 shrink-0 accent-[#2f8f7d]" />
                  <span className={`flex-1 font-semibold ${m.done ? 'line-through opacity-60' : ''}`}>{m.title}</span>
                  <button type="button" aria-label="Edit materi" onClick={e => { e.preventDefault(); setMode(m.id) }}>
                    <Icon name="edit" className="size-5" />
                  </button>
                  <button type="button" aria-label="Hapus materi"
                    onClick={e => { e.preventDefault(); if (confirm(`Hapus materi “${m.title}”?`)) removeMateri(bab.id, m.id) }}>
                    <Icon name="trash" className="size-5" />
                  </button>
                </summary>
                <div className="mt-3 border-t border-black/10 pt-3 text-sm leading-relaxed">
                  <p className="whitespace-pre-line">{m.content || 'Belum ada isi materi.'}</p>
                  {m.link && (
                    <a href={m.link} target="_blank" rel="noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold">
                      <Icon name="link" className="size-4" /> Buka tautan
                    </a>
                  )}
                </div>
              </details>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
