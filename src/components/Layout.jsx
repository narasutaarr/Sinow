import { NavLink, Outlet } from 'react-router-dom'
import Icon from './Icon.jsx'
import { useStore } from '../store.jsx'

const nav = [
  { to: '/', label: 'Home', icon: 'home', end: true },
  { to: '/materi', label: 'Materi', icon: 'book' },
  { to: '/peringkat', label: 'Peringkat', icon: 'chart' },
  { to: '/profil', label: 'Profil', icon: 'user' },
]

export default function Layout() {
  const { user } = useStore()
  return (
    <div className="flex min-h-screen pb-20 lg:pb-0">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-48 shrink-0 flex-col justify-center gap-6 bg-panel px-4 lg:flex">
        {nav.map(n => (
          <NavLink key={n.to} to={n.to} end={n.end}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-full px-4 py-2.5 transition-colors ${isActive ? 'bg-mint-active' : 'hover:bg-black/5'}`}>
            <Icon name={n.icon} className="size-8 shrink-0" />
            <span className="text-xs font-semibold">{n.label}</span>
          </NavLink>
        ))}
      </aside>

      {/* Navigasi bawah mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-10 flex justify-around bg-panel py-2 lg:hidden">
        {nav.map(n => (
          <NavLink key={n.to} to={n.to} end={n.end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-[10px] font-semibold ${isActive ? 'bg-mint-active' : 'text-black/70'}`}>
            <Icon name={n.icon} className="size-6" />
            {n.label}
          </NavLink>
        ))}
      </nav>

      <main className="mx-auto w-full min-w-0 max-w-[1080px] flex-1 px-4 py-6 sm:px-8 lg:px-12 lg:py-8">
        <header className="flex items-center justify-between border-b border-black/70 pb-5 sm:pb-7">
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="grid size-12 place-items-center rounded-full bg-gradient-to-b from-[#f4a0a8] to-[#e8808c] text-3xl shadow-md sm:size-16 sm:text-4xl" aria-hidden="true">🧑‍🎓</div>
            <h1 className="text-base font-semibold sm:text-xl">Hello {user.name}</h1>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button aria-label="Notifikasi"><Icon name="bell" className="size-7 sm:size-8" /></button>
            <button aria-label="Menu"><Icon name="menu" className="size-8 sm:size-9" /></button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  )
}
