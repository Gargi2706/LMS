const express = require("express");
const router = express.Router();
const { register, login, getProfile, changePassword, forgotPassword, resetPassword } = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/profile  (protected)
router.get("/profile", protect, getProfile);

// PUT /api/auth/change-password (protected)
router.put("/change-password", protect, changePassword);

// POST /api/auth/forgot-password
router.post("/forgot-password", forgotPassword);

// POST /api/auth/reset-password/:token
router.post("/reset-password/:token", resetPassword);

module.exports = router;
