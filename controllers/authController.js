const authService = require('../services/authServices');

exports.register = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    res.status(201).json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const result = await authService.login(req.body);
    res.json(result);
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await authService.getMe(req.user.id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

// JWT itu stateless: logout cukup dengan menghapus token di frontend
exports.logout = (req, res) => {
  res.json({ message: 'Logout berhasil, hapus token di sisi client' });
};