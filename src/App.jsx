import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import Materi from './pages/Materi.jsx'
import BabDetail from './pages/BabDetail.jsx'
import Placeholder from './pages/Placeholder.jsx'
import Profil from './pages/Profil.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="materi" element={<Materi />} />
        <Route path="materi/:babId" element={<BabDetail />} />
        <Route path="peringkat" element={<Placeholder title="Peringkat Belajar" />} />
        <Route path="ai" element={<Placeholder title="Belajar Bersama AI" />} />
        <Route path="profil" element={<Profil />} />
        <Route path="*" element={<Placeholder title="Halaman tidak ditemukan" />} />
      </Route>
    </Routes>
  )
}
