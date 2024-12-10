const express = require("express");
const { register, login, checkToken } = require("../controllers/authController");

const router = express.Router();

// Register user
router.post("/register", register);

// Login user
router.post("/login", login);

// checkToken
router.get("/check", checkToken);

module.exports = router;
