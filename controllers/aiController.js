const ai = require('../services/aiServices');

const handle = (fn) => async (req, res) => {
  try {
    res.json(await fn(req));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.chatWithAI = handle((req) => ai.chat(req.user.id, req.body));
exports.explainMaterial = handle((req) => ai.explain(req.user.id, req.body));
exports.summarizeMaterial = handle((req) => ai.summarize(req.user.id, req.body));
exports.generateQuiz = handle((req) => ai.generateQuiz(req.user.id, req.body));
exports.getMyStats = handle((req) => ai.getStats(req.user.id));