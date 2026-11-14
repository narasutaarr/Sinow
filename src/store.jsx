import { createContext, useContext, useEffect, useState } from 'react'
import { seed } from './data/seed.js'

const KEY = 'belajar-chapters-v1'
const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)
const uid = () => Math.random().toString(36).slice(2, 9)

const load = () => {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || seed.chapters
  } catch {
    return seed.chapters
  }
}

export function StoreProvider({ children }) {
  const [chapters, setChapters] = useState(load)

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(chapters)) } catch { /* abaikan */ }
  }, [chapters])

  const PROFILE_KEY = 'belajar-photo-v1'
  const [photo, setPhoto] = useState(() => {
    try { return localStorage.getItem(PROFILE_KEY) || '' } catch { return '' }
  })
  useEffect(() => {
    try { photo ? localStorage.setItem(PROFILE_KEY, photo) : localStorage.removeItem(PROFILE_KEY) } catch { /* abaikan */ }
  }, [photo])

  const GAME_KEY = 'belajar-games-v1'
const [games, setGames] = useState(() => {
  try { return JSON.parse(localStorage.getItem(GAME_KEY)) || [] } catch { return [] }
})
useEffect(() => {
  try { localStorage.setItem(GAME_KEY, JSON.stringify(games)) } catch { /* abaikan */ }
}, [games])

const gamePoints = games.reduce((n, g) => n + g.points, 0)
const gameHistory = games
  .map(g => ({ id: g.id, title: `Kuis: ${g.correct}/${g.total} benar`, date: g.date, points: g.points }))
  .reverse()

  const update = (babId, fn) =>
    setChapters(cs => cs.map(c => (c.id === babId ? { ...c, materi: fn(c.materi) } : c)))

  const value = {
    user: { ...seed.user, points: seed.user.points + gamePoints },
    chapters,
    photo,
    setPhoto,
    pointHistory: [...gameHistory, ...seed.pointHistory],
    games,
    addGame: g => setGames(l => [...l, {
      ...g,
      id: uid(),
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
    }]),
    addMateri: (babId, m) => update(babId, l => [...l, { ...m, id: uid(), done: false }]),
    editMateri: (babId, id, m) => update(babId, l => l.map(x => (x.id === id ? { ...x, ...m } : x))),
    removeMateri: (babId, id) => update(babId, l => l.filter(x => x.id !== id)),
    toggleDone: (babId, id) => update(babId, l => l.map(x => (x.id === id ? { ...x, done: !x.done } : x))),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
