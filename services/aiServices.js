const supabase = require('../config/supabase');
const { getRank } = require('../utils/rank');

// Gemini
const callGemini = async ({ system, contents, json = false }) => {
  const model = process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

  const body = {
    contents,
    ...(system && { systemInstruction: { parts: [{ text: system }] } }),
    ...(json && { generationConfig: { responseMimeType: 'application/json' } }),
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': process.env.GEMINI_API_KEY,
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error?.message || 'Gagal memanggil Gemini');

  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Gemini tidak mengembalikan jawaban');
  return text;
};

const userMsg = (text) => [{ role: 'user', parts: [{ text }] }];

// ---------- Statistik siswa ----------
const getStats = async (userId) => {
  const { data: user } = await supabase
    .from('users').select('name, points').eq('id', userId).single();

  const { data: answers } = await supabase
    .from('quiz_answers')
    .select('is_correct, created_at, quizzes(question, materials(title))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200);

  const { data: progress } = await supabase
    .from('progress')
    .select('score, completed, updated_at, materials(title)')
    .eq('user_id', userId);

  const list = answers || [];
  const total = list.length;
  const correct = list.filter((a) => a.is_correct).length;

  // akurasi per materi
  const byTopic = {};
  for (const a of list) {
    const t = a.quizzes?.materials?.title || 'Lainnya';
    byTopic[t] ??= { total: 0, correct: 0 };
    byTopic[t].total++;
    if (a.is_correct) byTopic[t].correct++;
  }
  const topics = Object.entries(byTopic)
    .map(([title, v]) => ({
      title, total: v.total, accuracy: Math.round((v.correct / v.total) * 100),
    }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const recentWrong = list
    .filter((a) => !a.is_correct).slice(0, 5)
    .map((a) => a.quizzes?.question).filter(Boolean);

  return {
    name: user?.name || 'Siswa',
    points: user?.points || 0,
    rank: getRank(user?.points || 0).name,
    totalAnswered: total,
    accuracy: total ? Math.round((correct / total) * 100) : null,
    weakTopics: topics.filter((t) => t.accuracy < 60 && t.total >= 3),
    strongTopics: topics.filter((t) => t.accuracy >= 80 && t.total >= 3),
    recentWrong,
    completedMaterials: (progress || []).filter((p) => p.completed).length,
    lastActivity: list[0]?.created_at || null,
  };
};

const statsText = (s) => {
  if (!s.totalAnswered) {
    return `Siswa bernama ${s.name} belum punya riwayat kuis. Mulai dari dasar dan ukur kemampuannya lewat pertanyaan singkat.`;
  }
  const fmt = (arr) => arr.map((t) => `${t.title} (${t.accuracy}%, ${t.total} soal)`).join('; ') || '-';
  return [
    `Nama: ${s.name}. Rank: ${s.rank} (${s.points} poin).`,
    `Total soal dijawab: ${s.totalAnswered}, akurasi keseluruhan ${s.accuracy}%.`,
    `Topik lemah: ${fmt(s.weakTopics)}`,
    `Topik kuat: ${fmt(s.strongTopics)}`,
    `Soal yang baru salah: ${s.recentWrong.join(' | ') || '-'}`,
    `Materi selesai: ${s.completedMaterials}. Aktivitas terakhir: ${s.lastActivity || '-'}`,
  ].join('\n');
};

// ---------- System prompt ----------
const systemPrompt = (stats) => `
Kamu adalah tutor matematika untuk siswa SMP (kelas 7-9) di Indonesia. Bahasa: Indonesia yang ramah, sederhana, dan menyemangati.
Hanya bahas matematika dan cara belajarnya. Jika diminta hal lain, arahkan sopan kembali ke belajar.

METODE MENGAJAR (wajib diterapkan):
1. Mulai dengan mengecek pemahaman awal lewat 1 pertanyaan singkat kalau topik baru.
2. Worked example: tunjukkan satu contoh lengkap langkah demi langkah, lalu beri soal serupa untuk dicoba siswa.
3. Scaffolding: saat siswa mengerjakan soal, JANGAN langsung beri jawaban akhir. Beri petunjuk bertahap (pertanyaan pancingan, lalu petunjuk yang lebih jelas). Beri jawaban penuh hanya jika siswa sudah mencoba atau meminta setelah buntu.
4. Retrieval practice: akhiri penjelasan dengan 1-2 pertanyaan agar siswa mengingat dan menjawab sendiri.
5. Analisis kesalahan: jelaskan jenis kesalahannya (misalnya lupa membalik tanda, salah mengalikan), bukan hanya "salah".
6. Spaced repetition dan interleaving: jika ada topik lemah atau lama tidak dilatih, ingatkan dan sisipkan soal ringan dari topik itu.
7. Gunakan analogi sehari-hari dan bahasa visual sederhana. Pecah penjelasan jadi langkah pendek. Satu konsep per pesan.
8. Beri pujian pada usaha dan strategi, bukan hanya hasil. Jangan merendahkan.
9. Tulis rumus dengan teks biasa (misalnya 2x + 3 = 11), jangan LaTeX.

DATA BELAJAR SISWA INI (gunakan untuk menyesuaikan tingkat kesulitan dan fokus; jangan dibacakan mentah-mentah):
${statsText(stats)}

Aturan adaptasi: akurasi < 60% pada topik = turunkan tingkat, lebih banyak contoh dan petunjuk. Akurasi > 80% = naikkan tingkat, kurangi petunjuk, beri soal tantangan.
`.trim();

// ---------- Helper materi ----------
const getMaterial = async (id) => {
  const { data, error } = await supabase
    .from('materials').select('title, content').eq('id', id).single();
  if (error) throw new Error('Materi tidak ditemukan');
  return data;
};

// ---------- Fitur ----------

// chat: history dikirim frontend [{ role: 'user'|'assistant', text }]
exports.chat = async (userId, { message, history = [] }) => {
  if (!message || !message.trim()) throw new Error('message wajib diisi');
  if (message.length > 2000) throw new Error('Pesan terlalu panjang');

  const stats = await getStats(userId);
  const past = (Array.isArray(history) ? history : []).slice(-10).map((h) => ({
    role: h.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: String(h.text || '').slice(0, 2000) }],
  }));

  const reply = await callGemini({
    system: systemPrompt(stats),
    contents: [...past, ...userMsg(message)],
  });
  return { reply };
};

exports.explain = async (userId, { material_id, question }) => {
  if (!material_id) throw new Error('material_id wajib diisi');
  const [m, stats] = await Promise.all([getMaterial(material_id), getStats(userId)]);

  const prompt = `Jelaskan materi berikut kepada siswa dengan metode mengajarmu.
${question ? `Fokus pada pertanyaan siswa: ${question}\n` : ''}
Judul: ${m.title}
Isi materi:
${m.content}`;

  return { explanation: await callGemini({
    system: systemPrompt(stats), contents: userMsg(prompt),
  }) };
};

exports.summarize = async (userId, { material_id }) => {
  if (!material_id) throw new Error('material_id wajib diisi');
  const m = await getMaterial(material_id);

  const prompt = `Ringkas materi berikut untuk siswa SMP: maksimal 5 poin inti, 1 contoh singkat, lalu 2 pertanyaan cek pemahaman (tanpa jawaban).
Judul: ${m.title}
${m.content}`;

  return { summary: await callGemini({
    system: 'Kamu tutor matematika SMP. Jawab dalam bahasa Indonesia yang sederhana, tulis rumus dengan teks biasa.',
    contents: userMsg(prompt),
  }) };
};

exports.generateQuiz = async (userId, { material_id, count = 5, focus_weak = true }) => {
  if (!material_id) throw new Error('material_id wajib diisi');
  const n = Math.min(Math.max(parseInt(count, 10) || 5, 1), 10);
  const [m, stats] = await Promise.all([getMaterial(material_id), getStats(userId)]);

  const weak = focus_weak && stats.weakTopics.length
    ? `Siswa lemah di: ${stats.weakTopics.map((t) => t.title).join(', ')}. Buat sebagian soal lebih mudah dan bertahap.`
    : '';

  const prompt = `Buat ${n} soal pilihan ganda matematika SMP dari materi berikut. ${weak}
Urutkan dari mudah ke sulit. Pengecoh harus berasal dari kesalahan umum siswa. Tiap soal punya 4 opsi, tepat 1 benar, dan "explanation" singkat berisi langkah penyelesaian.
Balas HANYA JSON array: [{"question":"","options":["","","",""],"correct_answer":"harus sama persis dengan salah satu options","explanation":""}]

Judul: ${m.title}
${m.content}`;

  const text = await callGemini({
    system: 'Kamu pembuat soal matematika SMP. Pastikan jawaban benar secara matematis. Tulis rumus dengan teks biasa.',
    contents: userMsg(prompt), json: true,
  });

  let questions;
  try { questions = JSON.parse(text.replace(/```json|```/g, '').trim()); }
  catch { throw new Error('Format soal dari AI tidak valid, coba lagi'); }

  // validasi: buang soal yang rusak
  const valid = (Array.isArray(questions) ? questions : []).filter(
    (q) => q.question && Array.isArray(q.options) && q.options.length === 4
      && q.options.includes(q.correct_answer)
  );
  if (!valid.length) throw new Error('Tidak ada soal valid, coba lagi');
  return { questions: valid };
};

exports.getStats = getStats;