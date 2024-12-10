const express = require("express");
const voucherController = require("../controllers/voucherController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.get("/", authMiddleware, voucherController.getMyVoucher);
router.post("/check", authMiddleware, voucherController.checkVoucher);

module.exports = router;
