const express = require("express");
const flashSaleController = require("../controllers/flashSaleController");
const adminMiddleware = require("../utils/adminMiddleware");

const router = express.Router();

router.post("/", adminMiddleware, flashSaleController.create);
router.get("/active", flashSaleController.readActive);

module.exports = router;
