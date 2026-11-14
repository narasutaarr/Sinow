const userService = require('../services/userServices');
const { getRank } = require('../utils/rank');

exports.getProfile = async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json({ ...user, rank: getRank(user.points || 0) });
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    res.json(await userService.updateProfile(req.user.id, req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.leaderboard = async (req, res) => {
  try {
    res.json(await userService.leaderboard(parseInt(req.query.limit, 10) || 10));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};