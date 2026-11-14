import { createContext, useContext, useState } from 'react'

const USERS_KEY = 'sinow-users-v1'
const SESSION_KEY = 'sinow-session-v1'
const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

const read = (store, key, fallback) => {
  try { return JSON.parse(store.getItem(key)) ?? fallback } catch { return fallback }
}
const write = (store, key, value) => {
  try { store.setItem(key, JSON.stringify(value)) } catch { /* abaikan */ }
}

export function AuthProvider({ children }) {
  // "Ingatkan saya" aktif -> localStorage, nonaktif -> sessionStorage (hilang saat tab ditutup)
  const [session, setSession] = useState(
    () => read(localStorage, SESSION_KEY, null) ?? read(sessionStorage, SESSION_KEY, null)
  )

  const clear = () => {
    try { localStorage.removeItem(SESSION_KEY); sessionStorage.removeItem(SESSION_KEY) } catch { /* abaikan */ }
  }

  const start = (username, remember) => {
    const s = { username }
    clear()
    write(remember ? localStorage : sessionStorage, SESSION_KEY, s)
    setSession(s)
  }

  const register = ({ username, email, password }) => {
    const users = read(localStorage, USERS_KEY, [])
    const u = username.trim().toLowerCase()
    const e = email.trim().toLowerCase()
    if (users.some(x => x.username.toLowerCase() === u)) return { ok: false, error: 'Username sudah dipakai.' }
    if (users.some(x => x.email === e)) return { ok: false, error: 'Email sudah terdaftar.' }
    write(localStorage, USERS_KEY, [...users, { username: username.trim(), email: e, password }])
    start(username.trim(), true)
    return { ok: true }
  }

  const login = ({ username, password, remember }) => {
    const users = read(localStorage, USERS_KEY, [])
    const found = users.find(
      x => x.username.toLowerCase() === username.trim().toLowerCase() && x.password === password
    )
    if (!found) return { ok: false, error: 'Username atau password salah.' }
    start(found.username, remember)
    return { ok: true }
  }

  const logout = () => { clear(); setSession(null) }

  return <Ctx.Provider value={{ session, register, login, logout }}>{children}</Ctx.Provider>
}