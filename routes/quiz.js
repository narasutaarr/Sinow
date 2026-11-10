const express = require("express");
const router = express.Router();

const {
    getQuizzesByMaterial,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuiz,
    submitByMaterial,
    generateAlgebra
} = require("../controllers/quizController");
const auth = require("../middleware/auth");
const role = require("../middleware/role");

// semua kuis dari satu materi
router.get("/material/:materialId", auth, getQuizzesByMaterial);

// submit semua jawaban satu materi, dapat skor
router.post("/material/:materialId/submit", auth, submitByMaterial);

// generate soal aljabar (admin)
router.post("/generate-algebra", auth, role("admin"), generateAlgebra);

// get kuis by id
router.get("/:id", auth, getQuizById);

// create kuis baru (admin)
router.post("/", auth, role("admin"), createQuiz);

// update kuis by id (admin)
router.put("/:id", auth, role("admin"), updateQuiz);

// delete kuis by id (admin)
router.delete("/:id", auth, role("admin"), deleteQuiz);

// submit jawaban satu soal
router.post("/:id/submit", auth, submitQuiz);

module.exports = router;