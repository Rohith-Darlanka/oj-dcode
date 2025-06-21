const express = require("express");
const { loginUser, registerUser, getProfile, verifyAuth  } = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");
const { logout } = require("../controllers/logout");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getProfile);
router.get("/verify", verifyToken, verifyAuth);
router.post("/logout",logout);

module.exports = router;
