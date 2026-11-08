const express = require("express");
const router = express.Router();

const {
    getProfile,
    updateProfile
} = require("../controllers/userController");

// GET profile
router.get("/profile", getProfile);

// POST update profile
router.post("/profile", updateProfile);

module.exports = router;