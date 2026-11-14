const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');
const { getRank } = require('../utils/rank');

exports.getUserById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, points')
    .eq('id', id)
    .single();

  if (error) throw new Error('User tidak ditemukan');
  return data;
};

exports.getAllUsers = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, email, role, points');

  if (error) throw new Error(error.message);
  return data;
};

exports.updateProfile = async (id, { name, password }) => {
  const fields = {};
  if (name) fields.name = name;
  if (password) fields.password = await bcrypt.hash(password, 10);
  if (Object.keys(fields).length === 0) {
    throw new Error('Tidak ada data yang diubah');
  }

  const { data, error } = await supabase
    .from('users')
    .update(fields)
    .eq('id', id)
    .select('id, name, email, role, points')
    .single();

  if (error) throw new Error(error.message);
  return data;
};

exports.leaderboard = async (limit = 10) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, name, points')
    .order('points', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data.map((u) => ({ ...u, rank: getRank(u.points || 0).name }));
};