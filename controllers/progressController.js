exports.getMyProgress = (req, res) => res.json({ message: "my progress" });
exports.getProgressByMaterial = (req, res) => res.json({ message: `progress of material ${req.params.materialId}` });
exports.updateProgress = (req, res) => res.json({ message: "update progress" });
exports.getLeaderboard = (req, res) => res.json({ message: "leaderboard" });
exports.getMyBadges = (req, res) => res.json({ message: "my badges" });