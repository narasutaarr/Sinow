const supabase = require('../config/supabase');

exports.getAll = async () => {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
};

exports.getById = async (id) => {
  const { data, error } = await supabase
    .from('materials')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error('Materi tidak ditemukan');
  return data;
};

exports.create = async ({ title, content, category }) => {
  if (!title) throw new Error('Judul wajib diisi');
  const { data, error } = await supabase
    .from('materials')
    .insert({ title, content, category })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

exports.update = async (id, fields) => {
  const { data, error } = await supabase
    .from('materials')
    .update(fields)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
};

exports.remove = async (id) => {
  const { error } = await supabase.from('materials').delete().eq('id', id);
  if (error) throw new Error(error.message);
};