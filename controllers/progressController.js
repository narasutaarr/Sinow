const progressService = require('../services/progressServices');

exports.getMyProgress = async (req, res) => {
  try {
    res.json(await progressService.getByUser(req.user.id));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.saveProgress = async (req, res) => {
  try {
    res.json(await progressService.save(req.user.id, req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};