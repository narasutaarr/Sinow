import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Materi from './pages/Materi.jsx'
import BabDetail from './pages/BabDetail.jsx'
import Placeholder from './pages/Placeholder.jsx'
import Profil from './pages/Profil.jsx'
import Peringkat from './pages/Peringkat.jsx'
import Kuis from './pages/Kuis.jsx'
import { Navigate, Outlet, Routes, Route } from 'react-router-dom'  
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import { useAuth } from './auth.jsx'

function RequireAuth() {
  const { session } = useAuth()
  return session ? <Outlet /> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/daftar" element={<Register />} />
      <Route element={<RequireAuth />}>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="materi" element={<Materi />} />
        <Route path="materi/:babId" element={<BabDetail />} />
        <Route path="peringkat" element={<Peringkat />} />
        <Route path="ai" element={<Placeholder title="Belajar Bersama AI" />} />
        <Route path="profil" element={<Profil />} />
        <Route path="kuis" element={<Kuis />} />
        <Route path="*" element={<Placeholder title="Halaman tidak ditemukan" />} />
      </Route>
      </Route>
    </Routes>
  )
}
