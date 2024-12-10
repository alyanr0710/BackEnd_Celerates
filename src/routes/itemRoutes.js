const express = require("express");
const upload = require("../utils/multerHelper");
const itemController = require("../controllers/itemController");
const adminMiddleware = require("../utils/adminMiddleware");

const router = express.Router();

router.get("/", itemController.read);
router.get("/:id", itemController.readById);
router.post("/", adminMiddleware, upload.array("images", 5), itemController.create);
router.put("/:id", adminMiddleware, upload.array("images", 5), itemController.update);
router.delete("/:id", adminMiddleware, itemController.delete);

module.exports = router;
