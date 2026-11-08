const express = require("express");
const router = express.Router();

const {
    getMyProgress,
    getProgressByMaterial,
    updateProgress,
    getLeaderboard,
    getMyBadges
} = require("../controllers/progressController");

// ringkasan progres id user (xp)
router.get("/", getMyProgress);

// leaderboard
router.get("/leaderboard", getLeaderboard);

// badges punya user
router.get("/badges", getMyBadges);

// progress user di satu materi
router.get("/material/:materialId", getProgressByMaterial);

// update progress
router.get("/update", updateProgress);

module.exports = router;