const express = require("express");
const router = express.Router();

const {
    chatWithAI,
    explainMaterial,
    summarizeMaterial,
    generateQuiz
} = require("../controllers/aiController");

// chat dengan AI
router.post("/chat", chatWithAI);

// jelaskan materi
router.post("/explain", explainMaterial);

// ringkas materi
router.post("/summarize", summarizeMaterial);

// buat kuis dari materi
router.post("/generate-quiz", generateQuiz);

module.exports = router;