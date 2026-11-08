const express = require("express");
const router = express.Router();

const {
    register,
    login,
    getMe,
    logout
} = require("../controllers/authController");

// akun baru
router.post("/register", register);

// login
router.post("/login", login);

// ambil data user login
router.get("/me", getMe);

// logout
router.post("/logout", logout);

module.exports = router;