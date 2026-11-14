const supabase = require('../config/supabase');
const { callGemini, userMsg } = require('./aiServices');
const { TOPICS } = require('../utils/topics');

const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

exports.topics = async () =>
  Object.entries(TOPICS).map(([key, t]) => ({ key, title: t.title, scope: t.scope }));

// ---------- mulai kuis ----------
exports.start = async (userId, { topic, count = 5 }) => {
  const t = TOPICS[topic];
  if (!t) throw new Error(`Topik tidak dikenal. Pilihan: ${Object.keys(TOPICS).join(', ')}`);
  const n = Math.min(Math.max(parseInt(count, 10) || 5, 3), 10);

  // subtopik acak + tingkat naik bertahap
  let subs = [];
  while (subs.length < n) {
    subs = subs.concat(shuffle(t.subtopics).slice(0, n - subs.length));
  }
  const plan = subs.map((s, i) => ({
    subtopic: s,
    level: i < n / 3 ? 'mudah' : i < (2 * n) / 3 ? 'sedang' : 'sulit',
  }));

  const prompt = `Buat ${n} soal pilihan ganda matematika SMP untuk topik "${t.title}" (${t.scope}).
Satu soal per baris rencana berikut, dengan subtopik dan tingkat kesulitan yang ditentukan:
${plan.map((p, i) => `${i + 1}. subtopik: ${p.subtopic}; tingkat: ${p.level}`).join('\n')}

Aturan:
- Angka dan konteks soal harus bervariasi dan baru.
- Tepat 4 opsi, tepat 1 benar. Pengecoh berasal dari kesalahan umum siswa.
- "correct_answer" harus sama persis dengan salah satu isi "options".
- "explanation": pembahasan langkah demi langkah yang singkat dan jelas, menyebut kesalahan umum yang dijebak pengecoh.
- Hitung ulang jawabanmu sebelum menulis. Jawaban benar harus tepat secara matematis.
- Tulis rumus dengan teks biasa, tanpa LaTeX dan tanpa simbol $.
Balas HANYA JSON array: [{"question":"","options":["","","",""],"correct_answer":"","explanation":""}]`;

  const text = await callGemini({
    system: 'Kamu pembuat soal matematika SMP di Indonesia. Bahasa Indonesia. Akurasi perhitungan adalah prioritas utama.',
    contents: userMsg(prompt),
    json: true,
  });

  let raw;
  try { raw = JSON.parse(text.replace(/```json|```/g, '').trim()); }
  catch { throw new Error('Format soal dari AI tidak valid, coba lagi'); }

  const valid = (Array.isArray(raw) ? raw : []).filter(
    (q) => q.question && q.explanation
      && Array.isArray(q.options) && q.options.length === 4
      && new Set(q.options).size === 4
      && q.options.includes(q.correct_answer)
  );
  if (!valid.length) throw new Error('Tidak ada soal valid dari AI, coba lagi');

  const { data: attempt, error: e1 } = await supabase
    .from('quiz_attempts').insert({ user_id: userId, topic }).select('id').single();
  if (e1) throw new Error(e1.message);

  const rows = valid.map((q) => ({
    attempt_id: attempt.id,
    topic,
    question: q.question,
    options: shuffle(q.options),
    correct_answer: q.correct_answer,
    explanation: q.explanation,
  }));
  const { data: saved, error: e2 } = await supabase
    .from('quizzes').insert(rows).select('id, question, options');
  if (e2) throw new Error(e2.message);

  return { attempt_id: attempt.id, topic: t.title, questions: saved };
};

// ---------- selesai kuis + pembahasan ----------
exports.finish = async (userId, attemptId) => {
  const { data: attempt, error } = await supabase
    .from('quiz_attempts').select('*')
    .eq('id', attemptId).eq('user_id', userId).single();
  if (error) throw new Error('Kuis tidak ditemukan');

  const { data: quizzes } = await supabase
    .from('quizzes')
    .select('id, question, options, correct_answer, explanation')
    .eq('attempt_id', attemptId).order('created_at');

  const ids = (quizzes || []).map((q) => q.id);
  const { data: answers } = await supabase
    .from('quiz_answers').select('quiz_id, answer, is_correct')
    .eq('user_id', userId).in('quiz_id', ids);

  const byQuiz = Object.fromEntries((answers || []).map((a) => [a.quiz_id, a]));
  const details = (quizzes || []).map((q) => ({
    quiz_id: q.id,
    question: q.question,
    options: q.options,
    your_answer: byQuiz[q.id]?.answer ?? null,
    correct_answer: q.correct_answer,
    is_correct: !!byQuiz[q.id]?.is_correct,
    explanation: q.explanation,
  }));

  const total = details.length;
  const correct = details.filter((d) => d.is_correct).length;
  const score = total ? Math.round((correct / total) * 100) : 0;

  // ulasan AI dibuat sekali, lalu disimpan
  let review = attempt.review;
  if (!attempt.finished_at) {
    const wrong = details.filter((d) => !d.is_correct);
    const prompt = `Siswa SMP baru menyelesaikan kuis "${TOPICS[attempt.topic].title}". Skor ${score} (${correct} benar dari ${total}).
${wrong.length
  ? 'Soal yang salah atau belum dijawab:\n' + wrong.map((d, i) =>
      `${i + 1}. ${d.question} | jawaban siswa: ${d.your_answer ?? 'tidak dijawab'} | jawaban benar: ${d.correct_answer}`).join('\n')
  : 'Semua soal dijawab benar.'}

Tulis ulasan singkat (maksimal 120 kata) dalam bahasa Indonesia yang hangat: (1) apresiasi usaha, (2) pola kesalahan yang terlihat dan cara memperbaikinya, (3) satu saran latihan berikutnya. Tulis rumus dengan teks biasa tanpa LaTeX.`;
    try {
      review = await callGemini({
        system: 'Kamu tutor matematika SMP yang suportif dan tidak menghakimi.',
        contents: userMsg(prompt),
      });
    } catch { review = null; } // kuis tetap selesai walau AI sedang sibuk

    await supabase.from('quiz_attempts')
      .update({ score, review, finished_at: new Date().toISOString() })
      .eq('id', attemptId);
  }

  return { attempt_id: attemptId, topic: TOPICS[attempt.topic].title, total, correct, score, review, details };
};