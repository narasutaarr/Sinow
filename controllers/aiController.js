exports.chatWithAI = (req, res) => res.json({ message: "chat" });
exports.explainMaterial = (req, res) => res.json({ message: "explain" });
exports.summarizeMaterial = (req, res) => res.json({ message: "summarize" });
exports.generateQuiz = (req, res) => res.json({ message: "generate quiz" });