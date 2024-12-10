const express = require("express");
const upload = require("../utils/multerHelper");
const transactionController = require("../controllers/transactionController");
const adminMiddleware = require("../utils/adminMiddleware");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.post("/", authMiddleware, transactionController.create);
router.get("/check/:id", authMiddleware, transactionController.checkPaymentStatus);
router.get("/", authMiddleware, transactionController.getTransaction);
router.post("/status-update/:id", authMiddleware, transactionController.updateTransactionStatus);
router.get("/admin", authMiddleware, transactionController.getAllTransaction);
router.get("/admin/:id", authMiddleware, transactionController.getTransactionById);

module.exports = router;
