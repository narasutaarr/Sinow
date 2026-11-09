const materialService = require('../services/materialServices');

exports.getAll = async (req, res) => {
  try {
    res.json(await materialService.getAll());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    res.json(await materialService.getById(req.params.id));
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.create = async (req, res) => {
  try {
    res.status(201).json(await materialService.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    res.json(await materialService.update(req.params.id, req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    await materialService.remove(req.params.id);
    res.json({ message: 'Materi dihapus' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};