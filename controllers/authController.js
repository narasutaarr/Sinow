exports.register = (req, res) => res.json({ message: "register" });
exports.login = (req, res) => res.json({ message: "login" });
exports.getMe = (req, res) => res.json({ message: "me" });
exports.logout = (req, res) => res.json({ message: "logout" });