const express = require("express");
const router = express.Router();
const { register, login, getProfile, changePassword } = require("../controllers/authController");
const { protect } = require("../middlewares/auth");

// POST /api/auth/register
router.post("/register", register);

// POST /api/auth/login
router.post("/login", login);

// GET /api/auth/profile  (protected)
router.get("/profile", protect, getProfile);

// PUT /api/auth/change-password (protected)
router.put("/change-password", protect, changePassword);

module.exports = router;
