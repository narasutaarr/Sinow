import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import StreakBadge from '../components/StreakBadge.jsx'
import { useStore } from '../store.jsx'

export default function Materi() {
  const { chapters } = useStore()
  const [q, setQ] = useState('')
  const list = chapters.filter(c => `${c.bab} ${c.title}`.toLowerCase().includes(q.trim().toLowerCase()))

  return (
    <>
      <div className="relative mt-5 sm:mt-6">
        <div className="mb-2 flex justify-end sm:absolute sm:right-0 sm:top-1/2 sm:mb-0 sm:-translate-y-1/2"><StreakBadge /></div>
        <h2 className="text-center text-lg font-semibold sm:text-xl">Materi Pembelajaran Numerasi</h2>
      </div>

      <label className="mx-auto mt-5 flex max-w-md items-center gap-3 rounded-full bg-[#bccbe9] px-5 py-3 focus-within:ring-2 focus-within:ring-[#5b4b8a]">
        <Icon name="search" className="size-6 shrink-0" />
        <input type="search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search" autoComplete="off"
          className="w-full bg-transparent text-base font-semibold outline-none placeholder:text-black/45" />
      </label>

      <section className="mx-auto mt-6 grid max-w-3xl gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-8">
        {list.length === 0 && (
          <p className="col-span-full py-10 text-center text-sm text-black/60">Materi tidak ditemukan. Coba kata kunci lain.</p>
        )}
        {list.map(c => (
          <Link key={c.id} to={`/materi/${c.id}`}
            className="flex h-40 flex-col items-center gap-5 rounded-2xl bg-lilac px-6 pt-8 text-center shadow-card transition-transform hover:-translate-y-0.5 sm:h-56 sm:gap-7 sm:pt-10">
            <span className="text-lg font-semibold">{c.bab}</span>
            <span className="max-w-[12ch] text-xl font-semibold leading-snug sm:max-w-[14ch] sm:text-2xl">{c.title}</span>
            <span className="text-[11px] font-medium text-black/60">{c.materi.length} materi</span>
          </Link>
        ))}
      </section>
    </>
  )
}
