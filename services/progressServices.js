const supabase = require('../config/supabase');

// ambil semua progres milik user
exports.getByUser = async (userId) => {
  const { data, error } = await supabase
    .from('progress')
    .select('*, materials(id, title, category)')
    .eq('user_id', userId);
  if (error) throw new Error(error.message);
  return data;
};

// simpan / perbarui progres untuk satu materi
exports.save = async (userId, { material_id, score, completed }) => {
  if (!material_id) throw new Error('material_id wajib diisi');

  const { data: existing } = await supabase
    .from('progress')
    .select('id')
    .eq('user_id', userId)
    .eq('material_id', material_id)
    .maybeSingle();

  const payload = {
    user_id: userId,
    material_id,
    score: score ?? 0,
    completed: completed ?? false,
    updated_at: new Date().toISOString(),
  };

  const query = existing
    ? supabase.from('progress').update(payload).eq('id', existing.id)
    : supabase.from('progress').insert(payload);

  const { data, error } = await query.select().single();
  if (error) throw new Error(error.message);
  return data;
};