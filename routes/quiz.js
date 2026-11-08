const express = require("express");
const router = express.Router();

const {
    getQuizzesByMaterial,
    getQuizById,
    createQuiz,
    updateQuiz,
    deleteQuiz,
    submitQuiz
} = require("../controllers/quizController");

// semua kuis dari satu materi
router.get("/material/:materialId", getQuizzesByMaterial);

// get kuis by id
router.get("/:id", getQuizById);

// create kuis baru
router.post("/", createQuiz);

// update kuis by id
router.put("/:id", updateQuiz);

// delete kuis by id
router.delete("/:id", deleteQuiz);

// submit jawaban kuis
router.post("/:id/submit", submitQuiz);

module.exports = router;