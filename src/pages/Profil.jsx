import { useRef, useState } from 'react'
import { useStore } from '../store.jsx'
import { ranks } from '../data/ranks.js'
import { useAuth } from '../auth.jsx'

const toDataUrl = (file, size = 320) =>
  new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      const s = Math.min(img.width, img.height)
      const c = document.createElement('canvas')
      c.width = c.height = size
      c.getContext('2d').drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size)
      URL.revokeObjectURL(url)
      resolve(c.toDataURL('image/jpeg', 0.85))
    }
    img.onerror = reject
    img.src = url
  })

function RankBadge({ rank, reached }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className={`flex flex-col items-center gap-2 ${reached ? '' : 'opacity-40 grayscale'}`}>
      {failed ? (
        // Placeholder sampai kamu menaruh gambar di public/ranks/
        <svg viewBox="0 0 64 64" className="size-16 sm:size-20" aria-hidden="true">
          <path d="M32 4 56 14v18c0 14-10 24-24 28C18 56 8 46 8 32V14z" fill={rank.color} stroke="#0003" strokeWidth="2" />
          <text x="32" y="40" textAnchor="middle" fontSize="22" fontWeight="700" fill="#fff">{rank.label[0]}</text>
        </svg>
      ) : (
        <img src={`/ranks/${rank.id}.png`} alt="" onError={() => setFailed(true)}
          className="size-16 object-contain sm:size-20" />
      )}
      <span className="text-xs font-semibold sm:text-sm">{rank.label}</span>
    </div>
  )
}

function Stat({ value, label, bg }) {
  return (
    <div className="flex h-32 flex-col items-center justify-between rounded-2xl px-2 py-4 text-center shadow-card sm:h-40 sm:py-5"
      style={{ background: bg }}>
      <span className="text-3xl font-semibold sm:text-4xl">{value}</span>
      <span className="text-xs font-semibold sm:text-sm">{label}</span>
    </div>
  )
}

export default function Profil() {
  const { session } = useAuth()
  const { user, chapters, photo, setPhoto } = useStore()
  const input = useRef(null)
  const totalModul = chapters.reduce((n, c) => n + c.materi.filter(m => m.done).length, 0)

  const onPick = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    try { setPhoto(await toDataUrl(file)) } catch { alert('Foto tidak bisa dibaca. Coba file gambar lain.') }
    e.target.value = ''
  }

  return (
    <section className="mt-6 grid gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.7fr)]">
      {/* Kartu foto */}
      <div className="flex flex-col items-center rounded-2xl bg-mint px-6 py-10 shadow-card">
        <button onClick={() => input.current.click()} aria-label="Ganti foto profil"
          className="group relative size-40 overflow-hidden rounded-full bg-white/60 sm:size-52">
          {photo
            ? <img src={photo} alt="Foto profil" className="size-full object-cover" />
            : <span className="grid size-full place-items-center text-7xl">🧑‍🎓</span>}
          <span className="absolute inset-x-0 bottom-0 bg-black/55 py-2 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
            Ganti foto
          </span>
        </button>
        <h2 className="mt-6 break-words text-center text-3xl font-semibold">{session.username}</h2>
        <div className="mt-4 flex gap-2">
          <button onClick={() => input.current.click()} className="rounded-full bg-white px-4 py-2 text-xs font-semibold">Ganti foto</button>
          {photo && <button onClick={() => setPhoto('')} className="rounded-full bg-mint-soft px-4 py-2 text-xs font-semibold">Hapus</button>}
        </div>
        <input ref={input} type="file" accept="image/*" onChange={onPick} className="hidden" />
      </div>

      {/* Statistik + rank */}
      <div className="flex min-w-0 flex-col gap-4 sm:gap-6">
        <div className="grid grid-cols-3 gap-3 sm:gap-6">
          <Stat value={user.streak} label="Streak" bg="#db5f3f" />
          <Stat value={user.points} label="Total Point" bg="#a67fe8" />
          <Stat value={totalModul} label="Total Modul" bg="#a9c4bb" />
        </div>

        <div className="flex-1 rounded-2xl bg-[#709dd9] px-4 py-6 shadow-card sm:px-8">
          <h3 className="text-center text-base font-semibold sm:text-lg">Rank yang pernah dicapai</h3>
          <div className="mt-6 grid grid-cols-4 gap-2 sm:mt-8">
            {ranks.map(r => <RankBadge key={r.id} rank={r} reached={user.points >= r.min} />)}
          </div>
        </div>
      </div>
    </section>
  )
}