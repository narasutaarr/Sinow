import { useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import AuthShell, { Field } from 'src/components/AuthShell.jsx'
import { useAuth } from '../auth.jsx'

export default function Register() {
  const { session, register } = useAuth()
  const [f, setF] = useState({ username: '', email: '', password: '', agree: false })
  const [error, setError] = useState('')

  if (session) return <Navigate to="/" replace />

  const set = k => e => setF({ ...f, [k]: e.target.value })
  const submit = e => {
    e.preventDefault()
    const res = register(f)
    if (!res.ok) setError(res.error)
  }

  return (
    <AuthShell title="Buat Akun Kamu" bg="#63c1af">
      <form onSubmit={submit} className="mt-8 space-y-4">
        <Field label="Username" value={f.username} onChange={set('username')} autoComplete="username" required minLength={3} />
        <Field label="Email" type="email" value={f.email} onChange={set('email')} autoComplete="email" required />
        <div>
          <Field label="Password" type="password" value={f.password} onChange={set('password')}
            autoComplete="new-password" required minLength={6} />
          <label className="mt-2 flex items-center gap-1.5 text-[11px]">
            <input type="checkbox" checked={f.agree} required className="size-3.5 accent-[#5b4b8a]"
              onChange={e => setF({ ...f, agree: e.target.checked })} />
            Saya setuju dengan syarat dan ketentuan
          </label>
        </div>

        {error && <p role="alert" className="text-center text-xs text-[#c0392b]">{error}</p>}

        <button className="mt-4 w-full rounded-2xl bg-[#a1b5e0] py-2.5 text-lg transition-transform hover:-translate-y-0.5">
          Daftar
        </button>
      </form>

      <p className="mt-6 text-center text-xs">
        Sudah punya akun? <Link to="/login" className="font-semibold underline">Masuk</Link>
      </p>
    </AuthShell>
  )
}