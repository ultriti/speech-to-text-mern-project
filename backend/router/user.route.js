const express = require("express");

const router = express.Router();

const {
  register,
  login,
  logout,
  getProfile,
} = require("../controllers/user.controller.js");

const authMiddleware = require("../middleware/auth.middleware");

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);

router.get("/profile", authMiddleware, getProfile);

module.exports = router;