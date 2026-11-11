const express = require("express");
const router = express.Router();

const {
    chatWithAI,
    explainMaterial,
    summarizeMaterial,
    generateQuiz,
    getMyStats
} = require("../controllers/aiController");
const auth = require("../middleware/auth");

// chat dengan AI
router.post("/chat", auth, chatWithAI);

// jelaskan materi
router.post("/explain", auth, explainMaterial);

// ringkas materi
router.post("/summarize", auth, summarizeMaterial);

// buat kuis dari materi
router.post("/generate-quiz", auth, generateQuiz);

// statistik belajar (untuk dashboard frontend)
router.get("/stats", auth, getMyStats);

module.exports = router;