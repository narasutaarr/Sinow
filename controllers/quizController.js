exports.getQuizzesByMaterial = (req, res) => res.json({ message: `quizzes of material ${req.params.materialId}` });
exports.getQuizById = (req, res) => res.json({ message: `get quiz ${req.params.id}` });
exports.createQuiz = (req, res) => res.json({ message: "create quiz" });
exports.updateQuiz = (req, res) => res.json({ message: `update quiz ${req.params.id}` });
exports.deleteQuiz = (req, res) => res.json({ message: `delete quiz ${req.params.id}` });
exports.submitQuiz = (req, res) => res.json({ message: `submit quiz ${req.params.id}` });