import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon.jsx'
import ProgressRing from '../components/ProgressRing.jsx'
import StreakBadge from '../components/StreakBadge.jsx'
import { useStore } from '../store.jsx'

const tabs = ['Hari Ini', 'Rencana Belajar', 'Tugas']
const card = 'min-h-40 sm:h-48 rounded-2xl px-6 sm:px-8 lg:px-12 shadow-card'
const title = 'text-2xl lg:text-3xl font-semibold leading-tight'

export default function Home() {
  const { user, chapters } = useStore()
  const [tab, setTab] = useState(0)

  // Progres dihitung dari materi yang sudah ditandai selesai di bab pertama
  const first = chapters[0]
  const total = first?.materi.length ?? 0
  const done = first?.materi.filter(m => m.done).length ?? 0
  const pct = total ? Math.round((done / total) * 100) : 0

  return (
    <>
      <div className="mt-5 flex items-center justify-between gap-4 sm:mt-7">
        <h2 className="text-lg font-semibold sm:text-xl">Siap belajar hari ini?</h2>
        <StreakBadge />
      </div>

      <div role="tablist" className="-mx-4 mt-5 flex gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:mt-7 sm:flex-wrap sm:gap-4 sm:px-0">
        {tabs.map((t, i) => (
          <button key={t} role="tab" aria-selected={i === tab} onClick={() => setTab(i)}
            className={`shrink-0 rounded-full px-4 py-2.5 text-[11px] font-semibold transition-colors ${i === tab ? 'bg-lilac' : 'bg-mint-soft hover:bg-mint/60'}`}>
            {t}
          </button>
        ))}
      </div>

      <section className="mt-6 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-6">
        <Link to="/peringkat" className={`${card} flex items-center justify-between gap-4 bg-lilac`}>
          <h3 className={title}>Peringkat<br />Belajar</h3>
          <div className="grid size-20 shrink-0 place-items-center rounded-full bg-[#1c1a16] text-5xl sm:size-24 lg:size-28 lg:text-6xl" aria-hidden="true">🦁</div>
        </Link>

        <Link to="/ai" className={`${card} relative flex items-center overflow-hidden bg-rose`}>
          <h3 className={title}>Belajar<br />Bersama AI</h3>
          <span className="absolute -bottom-2 right-3 text-8xl sm:right-6 lg:text-9xl" aria-hidden="true">🤖</span>
        </Link>

        <Link to={first ? `/materi/${first.id}` : '/materi'} className={`${card} flex items-center justify-between gap-4 bg-mint`}>
          <div>
            <h3 className={title}>Progres<br />Belajar</h3>
            <span className="mt-3 inline-block rounded-full bg-mint-soft px-3.5 py-1 text-[10px] font-semibold">
              Matematika {first?.bab.toLowerCase()}
            </span>
          </div>
          <ProgressRing pct={pct} />
        </Link>

        <Link to="/kuis" className={`${card} flex flex-col justify-center bg-lilac py-5`}>
          <div className="flex items-center gap-2.5 text-base font-semibold lg:text-lg">
            <Icon name="open" className="size-9" /> Kuis
          </div>
          <p className="mt-5 text-2xl font-semibold lg:text-3xl">
            {user.todayPct}<span className="text-xl">%</span> / {user.todayMin} min
          </p>
          <div className="mt-3 h-4 overflow-hidden rounded-full border border-black bg-white" role="progressbar"
            aria-valuenow={user.todayPct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full rounded-full bg-mint" style={{ width: `${user.todayPct}%` }} />
          </div>
        </Link>
      </section>
    </>
  )
}
