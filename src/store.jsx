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

  const update = (babId, fn) =>
    setChapters(cs => cs.map(c => (c.id === babId ? { ...c, materi: fn(c.materi) } : c)))

  const value = {
    user: seed.user,
    chapters,
    addMateri: (babId, m) => update(babId, l => [...l, { ...m, id: uid(), done: false }]),
    editMateri: (babId, id, m) => update(babId, l => l.map(x => (x.id === id ? { ...x, ...m } : x))),
    removeMateri: (babId, id) => update(babId, l => l.filter(x => x.id !== id)),
    toggleDone: (babId, id) => update(babId, l => l.map(x => (x.id === id ? { ...x, done: !x.done } : x))),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
