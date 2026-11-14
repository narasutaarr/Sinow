import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AuthShell, { Field } from 'src/components/AuthShell.jsx'
import { useAuth } from '../auth.jsx'

export default function Login() {
  const { session, login } = useAuth()
  const [f, setF] = useState({ username: '', password: '', remember: false })
  const [error, setError] = useState('')

  if (session) return <Navigate to="/" replace />

  const submit = e => {
    e.preventDefault()
    const res = login(f)
    if (!res.ok) setError(res.error)
  }

  return (
    <AuthShell title="Welcome to Sinow">
      <form onSubmit={submit} className="mt-10 space-y-4">
        <Field label="Username" value={f.username} autoComplete="username" required
          onChange={e => setF({ ...f, username: e.target.value })} />
        <div>
          <Field label="Password" type="password" value={f.password} autoComplete="current-password" required
            onChange={e => setF({ ...f, password: e.target.value })} />
          <div className="mt-2 flex items-center justify-between text-[11px]">
            <label className="flex items-center gap-1.5">
              <input type="checkbox" checked={f.remember} className="size-3.5 accent-[#5b4b8a]"
                onChange={e => setF({ ...f, remember: e.target.checked })} />
              Ingatkan saya
            </label>
            <button type="button" onClick={() => alert('Fitur lupa sandi belum tersedia.')} className="underline">
              Lupa sandi?
            </button>
          </div>
        </div>

        {error && <p role="alert" className="text-center text-xs text-[#c0392b]">{error}</p>}

        <button className="mt-4 w-full rounded-2xl bg-[#a1b5e0] py-2.5 text-lg transition-transform hover:-translate-y-0.5">
          Masuk
        </button>
      </form>

      <div className="mt-7 flex items-center gap-3 text-xs">
        <span className="h-px flex-1 bg-black" /> Tidak punya akun? <span className="h-px flex-1 bg-black" />
      </div>
      <Link to="/daftar" className="mt-5 block rounded-2xl border border-black py-2 text-center text-sm hover:bg-black/5">
        Buat akun
      </Link>
    </AuthShell>
  )
}