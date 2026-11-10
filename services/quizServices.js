const supabase = require("../config/supabase");
const { getRank, POINT_CORRECT, POINT_WRONG } = require("../utils/rank");
const { generateQuestions } = require("../utils/algebraTemplates");

// siswa tidak boleh melihat jawaban benar, admin boleh
const cols = (withAnswer) =>
  withAnswer
    ? "id, material_id, question, options, correct_answer, created_at"
    : "id, material_id, question, options, created_at";

exports.getByMaterial = async (materialId, withAnswer = false) => {
  const { data, error } = await supabase
    .from("quizzes").select(cols(withAnswer)).eq("material_id", materialId);
  if (error) throw new Error(error.message);
  return data;
};

exports.getById = async (id, withAnswer = false) => {
  const { data, error } = await supabase
    .from("quizzes").select(cols(withAnswer)).eq("id", id).single();
  if (error) throw new Error("Kuis tidak ditemukan");
  return data;
};

exports.create = async ({ material_id, question, options, correct_answer }) => {
  if (!material_id || !question || !Array.isArray(options) || !correct_answer) {
    throw new Error("material_id, question, options (array), correct_answer wajib diisi");
  }
  if (!options.includes(correct_answer)) {
    throw new Error("correct_answer harus salah satu isi options");
  }
  const { data, error } = await supabase
    .from("quizzes")
    .insert({ material_id, question, options, correct_answer })
    .select().single();
  if (error) throw new Error(error.message);
  return data;
};

exports.update = async (id, body) => {
  const fields = {};
  for (const k of ["question", "options", "correct_answer"]) {
    if (body[k] !== undefined) fields[k] = body[k];
  }
  if (Object.keys(fields).length === 0) throw new Error("Tidak ada data yang diubah");

  const { data, error } = await supabase
    .from("quizzes").update(fields).eq("id", id).select().single();
  if (error) throw new Error(error.message);
  return data;
};

exports.remove = async (id) => {
  const { error } = await supabase.from("quizzes").delete().eq("id", id);
  if (error) throw new Error(error.message);
};

// jawab satu soal
exports.submitOne = async (userId, id, answer) => {
  if (answer === undefined || answer === null) throw new Error("answer wajib diisi");

  const { data: quiz, error } = await supabase
    .from("quizzes").select("id, correct_answer").eq("id", id).single();
  if (error) throw new Error("Kuis tidak ditemukan");

  const correct = answer === quiz.correct_answer;

  // sudah pernah dijawab? jangan hitung poin lagi
  const { data: prev } = await supabase
    .from("quiz_answers").select("id")
    .eq("user_id", userId).eq("quiz_id", id).maybeSingle();

  const { data: user } = await supabase
    .from("users").select("points").eq("id", userId).single();
  let points = user.points;
  let change = 0;

  if (!prev) {
    change = correct ? POINT_CORRECT : POINT_WRONG;
    points = Math.max(0, points + change);

    const { error: e1 } = await supabase.from("quiz_answers").insert({
      user_id: userId, quiz_id: id, is_correct: correct, points_change: change,
    });
    if (e1) throw new Error(e1.message);

    const { error: e2 } = await supabase
      .from("users").update({ points }).eq("id", userId);
    if (e2) throw new Error(e2.message);
  }

  return {
    quiz_id: id,
    correct,
    points_change: change,
    already_answered: !!prev,
    points,
    rank: getRank(points),
  };
};

// answers: [{ quiz_id, answer }]
exports.submitByMaterial = async (materialId, answers) => {
  if (!Array.isArray(answers) || answers.length === 0) {
    throw new Error("answers wajib berupa array");
  }
  const { data: questions, error } = await supabase
    .from("quizzes").select("id, correct_answer").eq("material_id", materialId);
  if (error) throw new Error(error.message);

  let correct = 0;
  const details = questions.map((q) => {
    const given = answers.find((a) => a.quiz_id === q.id);
    const ok = !!given && given.answer === q.correct_answer;
    if (ok) correct++;
    return { quiz_id: q.id, correct: ok, correct_answer: q.correct_answer };
  });

  const total = questions.length;
  const score = total ? Math.round((correct / total) * 100) : 0;
  return { correct, total, score, details };
};

exports.generateAlgebra = async ({ material_id, topics, count = 5, save = true }) => {
  const n = Math.min(Math.max(parseInt(count, 10) || 5, 1), 20);
  const questions = generateQuestions(n, topics && topics.length ? topics : undefined);

  if (!save) return questions;
  if (!material_id) throw new Error("material_id wajib diisi untuk menyimpan soal");

  const rows = questions.map((q) => ({ ...q, material_id }));
  const { data, error } = await supabase
    .from("quizzes").insert(rows).select(cols(true));
  if (error) throw new Error(error.message);
  return data;
};