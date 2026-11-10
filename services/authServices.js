const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const supabase = require('../config/supabase');
const { getRank } = require('../utils/rank');

const createToken = (user) =>
  jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

exports.register = async ({ name, email, password }) => {
  if (!name || !email || !password) {
    throw new Error('Nama, email, dan password wajib diisi');
  }

  // cek email sudah dipakai atau belum
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('email', email)
    .maybeSingle();
  if (existing) throw new Error('Email sudah terdaftar');

  const hashed = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('users')
    .insert({ name, email, password: hashed })
    .select('id, name, email, role')
    .single();
  if (error) throw new Error(error.message);

  return { user: data, token: createToken(data) };
};

exports.login = async ({ email, password }) => {
  if (!email || !password) throw new Error('Email dan password wajib diisi');

  const { data: user } = await supabase
    .from('users')
    .select('*')
    .eq('email', email)
    .maybeSingle();

  // pesan sengaja sama, supaya tidak membocorkan email mana yang terdaftar
  if (!user) throw new Error('Email atau password salah');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Email atau password salah');

  const { password: _, ...safeUser } = user; // buang password dari response
  return { user: safeUser, token: createToken(user) };
};

exports.getMe = async (id) => {
  const { data, error } = await supabase
    .from('users').select('id, name, email, role, points').eq('id', id).single();
  if (error) throw new Error('User tidak ditemukan');
  return { ...data, rank: getRank(data.points) };
};