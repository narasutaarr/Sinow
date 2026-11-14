const quizService = require("../services/quizServices");
const quizGen = require("../services/quizGenServices");

const handle = (fn, okStatus = 200, errStatus = 400) => async (req, res) => {
  try {
    res.status(okStatus).json(await fn(req));
  } catch (err) {
    res.status(errStatus).json({ message: err.message });
  }
};

const isAdmin = (req) => req.user?.role === "admin";

// ----- fitur baru -----
exports.getTopics = handle(() => quizGen.topics());
exports.startQuiz = handle((req) => quizGen.start(req.user.id, req.body), 201);
exports.finishAttempt = handle((req) => quizGen.finish(req.user.id, req.params.id));

// ----- fitur lama -----
exports.getQuizzesByMaterial = handle(
  (req) => quizService.getByMaterial(req.params.materialId, isAdmin(req)), 200, 500
);
exports.getQuizById = handle(
  (req) => quizService.getById(req.params.id, isAdmin(req)), 200, 404
);
exports.createQuiz = handle((req) => quizService.create(req.body), 201);
exports.updateQuiz = handle((req) => quizService.update(req.params.id, req.body));
exports.deleteQuiz = handle(async (req) => {
  await quizService.remove(req.params.id);
  return { message: "Kuis dihapus" };
});
exports.submitQuiz = handle(
  (req) => quizService.submitOne(req.user.id, req.params.id, req.body.answer)
);
exports.submitByMaterial = handle(
  (req) => quizService.submitByMaterial(req.params.materialId, req.body.answers)
);
exports.generateAlgebra = handle((req) => quizService.generateAlgebra(req.body), 201);