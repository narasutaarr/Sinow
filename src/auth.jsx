import { createContext, useContext, useEffect, useState } from 'react'
import { api, getSession } from './lib/api.js'

const KEY = 'sinow-session-v1'
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

const pickName = d =>
  d?.user?.nama ?? d?.user?.name ?? d?.nama ?? d?.name ?? d?.data?.nama ?? d?.data?.name ?? null

export function AuthProvider({ children }) {
  const [session, setSession] = useState(getSession)

  const clear = () => {
    try { localStorage.removeItem(KEY); sessionStorage.removeItem(KEY) } catch { /* abaikan */ }
  }

  // "Ingatkan saya" aktif -> localStorage, nonaktif -> sessionStorage
  const start = (s, remember) => {
    clear()
    try { (remember ? localStorage : sessionStorage).setItem(KEY, JSON.stringify(s)) } catch { /* abaikan */ }
    setSession(s)
  }

  const logout = () => { clear(); setSession(null) }

  const rename = name => setSession(s => {
  if (!s || !name || s.username === name) return s
  const next = { ...s, username: name }
  try {
    const store = localStorage.getItem(KEY) ? localStorage : sessionStorage
    store.setItem(KEY, JSON.stringify(next))
  } catch { /* abaikan */ }
  return next
})

const loadName = async () => {
  try {
    rename(pickName(await api('/api/auth/me')))
  } catch { /* abaikan, nama tetap seperti sekarang */ }
}
const login = async ({ username, password, remember }) => {
  try {
    const data = await api('/api/auth/login', {
      method: 'POST', auth: false,
      body: { email: username, password },
    })
    start({ username: pickName(data) ?? username, token: data.token }, remember)
    loadName()   // ambil nama dari /api/auth/me
    return { ok: true }
  } catch (e) {
    return { ok: false, error: e.message }
  }
}


const register = async ({ username, email, password }) => {
  try {
    await api('/api/auth/register', {
      method: 'POST', auth: false,
      body: { name: username, email, password },   // ← kirim nama dan name
    })
    return login({ username: email, password, remember: true })
  } catch (e) {
    return { ok: false, error: e.message }
  }
}

  // Token ditolak backend (kedaluwarsa) -> keluar otomatis
  useEffect(() => {
    window.addEventListener('auth:expired', logout)
    return () => window.removeEventListener('auth:expired', logout)
  }, [])

  useEffect(() => {
    if (getSession()) loadName()
  }, [])

  return <Ctx.Provider value={{ session, login, register, logout }}>{children}</Ctx.Provider>
}