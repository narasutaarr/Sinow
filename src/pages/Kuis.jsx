import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store.jsx'
import { getRank } from '../data/ranks.js'
import { questions, POINTS_PER_CORRECT } from '../data/quiz.js'

// Gambar rank dari public/ranks/<id>.png, dengan perisai pengganti kalau file belum ada
function RankBadge({ rank, className = 'size-20 sm:size-24' }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
        <path d="M32 4 56 14v18c0 14-10 24-24 28C18 56 8 46 8 32V14z" fill={rank.color} stroke="#0003" strokeWidth="2" />
        <text x="32" y="40" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff">{rank.label[0]}</text>
      </svg>
    )
  }
  return <img src={`/ranks/${rank.id}.png`} alt="" onError={() => setFailed(true)} className={`${className} object-contain`} />
}

function Donut({ correct, wrong }) {
  const total = correct + wrong
  const r = 40
  const c = 2 * Math.PI * r
  const pct = total ? correct / total : 0
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5">
      <div className="relative">
        <svg viewBox="0 0 100 100" className="size-36 -rotate-90 sm:size-40" role="img"
          aria-label={total ? `${correct} benar, ${wrong} salah` : 'Belum ada data'}>
          <circle cx="50" cy="50" r={r} fill="none" stroke={total ? '#f0a8a0' : '#e8ecf5'} strokeWidth="14" />
          {total > 0 && (
            <circle cx="50" cy="50" r={r} fill="none" stroke="#5ad7c3" strokeWidth="14"
              strokeDasharray={c} strokeDashoffset={c * (1 - pct)} />
          )}
        </svg>
        {total > 0 && (
          <span className="absolute inset-0 grid place-items-center text-xl font-semibold">{Math.round(pct * 100)}%</span>
        )}
      </div>
      {total > 0 ? (
        <div className="flex gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5"><i className="size-3 rounded-full bg-[#5ad7c3]" />Benar {correct}</span>
          <span className="flex items-center gap-1.5"><i className="size-3 rounded-full bg-[#f0a8a0]" />Salah {wrong}</span>
        </div>
      ) : (
        <p className="text-xs text-black/50">Belum ada permainan</p>
      )}
    </div>
  )
}

export default function Kuis() {
  const { user, games, addGame } = useStore()
  const [phase, setPhase] = useState('home') // home | play | result
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState(null)
  const [correct, setCorrect] = useState(0)
  const [bannerFailed, setBannerFailed] = useState(false)

  const rank = getRank(user.points)
  const last = games[games.length - 1]
  const totalCorrect = games.reduce((n, g) => n + g.correct, 0)
  const totalWrong = games.reduce((n, g) => n + (g.total - g.correct), 0)

  const start = () => { setI(0); setPicked(null); setCorrect(0); setPhase('play') }
  const choose = idx => {
    if (picked !== null) return
    setPicked(idx)
    if (idx === questions[i].answer) setCorrect(c => c + 1)
  }
  const next = () => {
    if (i < questions.length - 1) { setI(i + 1); setPicked(null); return }
    addGame({ correct, total: questions.length, points: correct * POINTS_PER_CORRECT })
    setPhase('result')
  }

  /* ---------- Main ---------- */
  if (phase === 'play') {
    const q = questions[i]
    return (
      <div className="mx-auto mt-6 max-w-2xl sm:mt-8">
        <div className="flex items-center justify-between text-sm font-semibold">
          <span>Soal {i + 1} / {questions.length}</span>
          <button onClick={() => setPhase('home')} className="text-black/60 underline">Keluar</button>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-[#e8ecf5]">
          <div className="h-full rounded-full bg-[#5ad7c3] transition-all" style={{ width: `${((i + (picked !== null)) / questions.length) * 100}%` }} />
        </div>

        <h2 className="mt-8 text-xl font-semibold sm:text-2xl">{q.text}</h2>
        <ul className="mt-6 space-y-3">
          {q.options.map((o, idx) => {
            const isAnswer = idx === q.answer
            const state = picked === null ? 'bg-[#e4eafa] hover:bg-[#d6defa]'
              : isAnswer ? 'bg-[#5ad7c3]'
              : idx === picked ? 'bg-[#f0a8a0]' : 'bg-[#e4eafa] opacity-50'
            return (
              <li key={idx}>
                <button onClick={() => choose(idx)} disabled={picked !== null}
                  className={`w-full rounded-2xl px-5 py-4 text-left font-semibold transition-colors ${state}`}>
                  <span className="mr-3 text-black/50">{String.fromCharCode(65 + idx)}</span>{o}
                </button>
              </li>
            )
          })}
        </ul>

        {picked !== null && (
          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-sm font-semibold">{picked === q.answer ? 'Benar! 🎉' : 'Kurang tepat.'}</p>
            <button onClick={next} className="rounded-2xl bg-[#5ad7c3] px-8 py-3 font-semibold shadow-card">
              {i < questions.length - 1 ? 'Lanjut' : 'Lihat hasil'}
            </button>
          </div>
        )}
      </div>
    )
  }

  /* ---------- Hasil ---------- */
  if (phase === 'result') {
    return (
      <div className="mx-auto mt-10 flex max-w-md flex-col items-center rounded-2xl bg-[#e4eafa] px-6 py-10 text-center shadow-card">
        <RankBadge rank={rank} className="size-28" />
        <h2 className="mt-4 text-2xl font-semibold">{correct} dari {questions.length} benar</h2>
        <p className="mt-2 text-lg font-semibold text-[#2f8f7d]">+{correct * POINTS_PER_CORRECT} poin</p>
        <p className="mt-1 text-xs text-black/60">Rank kamu sekarang: {rank.label}</p>
        <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
          <button onClick={start} className="flex-1 rounded-2xl bg-[#5ad7c3] py-3 font-semibold shadow-card">Main lagi</button>
          <Link to="/peringkat" className="flex-1 rounded-2xl bg-white py-3 font-semibold shadow-card">Lihat peringkat</Link>
        </div>
      </div>
    )
  }

  /* ---------- Awal (sesuai desain) ---------- */
  return (
    <>
      <div className="mt-5 h-40 overflow-hidden rounded-2xl bg-[#1e1e1e] sm:mt-6 sm:h-64 lg:h-72">
        {!bannerFailed ? (
          <img src="/quiz-banner.jpg" alt="" onError={() => setBannerFailed(true)} className="size-full object-cover" />
        ) : (
          <div className="grid size-full place-items-center bg-gradient-to-br from-[#2b2540] to-[#1e1e1e] text-7xl sm:text-8xl" aria-hidden="true">🎮</div>
        )}
      </div>

      <h2 className="mt-6 text-lg font-semibold sm:text-xl">Permainan Terakhir</h2>

      <section className="mt-4 grid gap-4 sm:gap-6 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="flex flex-col gap-4 sm:gap-6">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="flex h-44 flex-col items-center justify-between rounded-2xl bg-[#e4eafa] px-3 py-6 text-center shadow-card sm:h-48">
              <span className="flex flex-1 items-center text-4xl font-semibold text-[#5b7bb5]">
                {last ? `+${last.points}` : '–'}
              </span>
              <span className="text-xs font-semibold text-[#3b4d73] sm:text-sm">Point yang didapat</span>
            </div>
            <div className="flex h-44 flex-col items-center justify-between rounded-2xl bg-[#e4eafa] px-3 py-6 text-center shadow-card sm:h-48">
              <span className="flex flex-1 items-center"><RankBadge rank={rank} /></span>
              <span className="text-xs font-semibold text-[#3b4d73] sm:text-sm">Rank saat ini</span>
            </div>
          </div>
          <button onClick={start}
            className="rounded-2xl bg-[#5ad7c3] py-4 text-xl font-semibold text-[#0f3b34] shadow-[0_4px_0_#b5d9d3] transition-transform hover:-translate-y-0.5">
            Mulai
          </button>
        </div>

        <div className="flex min-h-64 flex-col rounded-2xl border border-black/10 bg-white p-5">
          <h3 className="font-semibold text-[#1a2340]">Statistik Game</h3>
          <Donut correct={totalCorrect} wrong={totalWrong} />
        </div>
      </section>
    </>
  )
}