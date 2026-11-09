const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getMe,
    logout
} = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

// akun baru
router.post("/register", register);

// login
router.post("/login", login);

// ambil data user login (wajib token)
router.get("/me", authMiddleware, getMe);

// logout
router.post("/logout", logout);

module.exports = router;