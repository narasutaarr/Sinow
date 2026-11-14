import { useState } from 'react'
import { Link } from 'react-router-dom'
import StreakBadge from '../components/StreakBadge.jsx'
import { useStore } from '../store.jsx'
import { ranks } from '../data/ranks.js'

const fmt = n => n.toLocaleString('id-ID')

// Gambar rank 
function RankImage({ rank }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <svg viewBox="0 0 64 64" className="size-36 sm:size-44" aria-hidden="true">
        <path d="M32 4 56 14v18c0 14-10 24-24 28C18 56 8 46 8 32V14z" fill={rank.color} stroke="#0003" strokeWidth="2" />
        <text x="32" y="40" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff">{rank.label[0]}</text>
      </svg>
    )
  }
  return <img src={`/ranks/${rank.id}.png`} alt="" onError={() => setFailed(true)} className="size-36 object-contain sm:size-44" />
}

export default function Peringkat() {
  const { user, pointHistory } = useStore()

  // Rank sekarang = rank tertinggi yang batas poinnya sudah terlewati
  const idx = ranks.reduce((acc, r, i) => (user.points >= r.min ? i : acc), 0)
  const rank = ranks[idx]
  const next = ranks[idx + 1]
  const pct = next ? Math.min(100, Math.round((user.points / next.min) * 100)) : 100

  return (
    <>
      <div className="mt-5 flex justify-end sm:mt-6"><StreakBadge /></div>

      <section className="mt-4 grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.8fr)]">
        {/* Kartu rank */}
        <div className="flex flex-col items-center rounded-2xl bg-lilac px-6 py-8 shadow-card">
          <RankImage rank={rank} />
          <h2 className="mt-4 text-2xl font-semibold">{rank.label}</h2>

          <div className="mt-8 w-full max-w-xs">
            <div className="text-xs font-semibold">Exp Bar</div>
            <div className="mt-2 h-3.5 overflow-hidden rounded-full bg-[#efefef]" role="progressbar"
              aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
              <div className="h-full rounded-full bg-[#a67fe8] transition-all" style={{ width: `${pct}%` }} />
            </div>
            <p className="mt-3 text-center text-xs font-semibold">
              {next ? `${fmt(user.points)} / ${fmt(next.min)}` : 'Rank tertinggi tercapai'}
            </p>
          </div>

          <Link to="/kuis"
            className="mt-8 w-full max-w-xs rounded-xl bg-[#a1b5e0] py-3 text-center text-lg font-semibold shadow-card transition-transform hover:-translate-y-0.5">
            &gt; Main
          </Link>
        </div>

        {/* Riwayat poin */}
        <div className="min-w-0 rounded-md bg-[#f0f0f0] px-4 py-5 shadow-card sm:px-6">
          <h3 className="text-lg font-semibold">Riwayat Poin</h3>
          <ul className="mt-5 max-h-[26rem] space-y-3 overflow-y-auto p-1">
            {pointHistory.length === 0 && (
              <li className="py-10 text-center text-sm text-black/60">Belum ada riwayat poin.</li>
            )}
            {pointHistory.map(p => (
              <li key={p.id} className="flex items-center justify-between gap-3 rounded-full bg-white px-5 py-3.5 shadow-card sm:px-6">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{p.title}</p>
                  <p className="text-[11px] text-black/50">{p.date}</p>
                </div>
                <span className={`shrink-0 text-sm font-semibold ${p.points >= 0 ? 'text-[#2f8f7d]' : 'text-[#db5f3f]'}`}>
                  {p.points > 0 ? '+' : ''}{p.points}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}