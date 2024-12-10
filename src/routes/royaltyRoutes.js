const express = require("express");
const royaltiController = require("../controllers/royaltyController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, royaltiController.getUserRoyalty);

module.exports = router;
