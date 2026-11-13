// Data awal. Tambah bab / materi langsung di sini, atau lewat tombol "Tambah materi" di aplikasi.
// Materi yang ditambah lewat aplikasi disimpan di localStorage browser.
// Kalau mengubah file ini dan hasilnya tidak berubah, ganti KEY di src/store.jsx (mis. v2).
export const seed = {
  user: { name: 'Franky', username: 'franky', streak: 10, todayPct: 58, todayMin: 28 },
  chapters: [
    {
      id: 'bab-1',
      bab: 'BAB I',
      title: 'Bilangan dan Operasi',
      materi: [
        {
          id: 'm-1',
          title: 'Bilangan bulat',
          content: 'Bilangan bulat terdiri dari bilangan positif, nol, dan bilangan negatif.',
          link: '',
          done: false,
        },
      ],
    },
    { id: 'bab-2', bab: 'BAB II', title: 'Aljabar', materi: [] },
    { id: 'bab-3', bab: 'BAB III', title: 'Geometri dan Pengukuran', materi: [] },
    { id: 'bab-4', bab: 'BAB IV', title: 'Data dan Statistika', materi: [] },
  ],
}
