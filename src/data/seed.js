
export const seed = {
  user: { name: 'Franky', username: 'franky', streak: 10, points: 1000, todayPct: 58, todayMin: 28 },
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
  pointHistory: [
  { id: 'p1', title: 'Menyelesaikan materi Bilangan bulat', date: '13 Nov 2026', points: 50 },
  { id: 'p2', title: 'Streak 10 hari', date: '13 Nov 2026', points: 100 },
  { id: 'p3', title: 'Kuis BAB I', date: '12 Nov 2026', points: 80 },
  { id: 'p4', title: 'Belajar bersama AI', date: '11 Nov 2026', points: 30 },
  { id: 'p5', title: 'Menyelesaikan materi Aljabar', date: '10 Nov 2026', points: 50 },
  ],
}
