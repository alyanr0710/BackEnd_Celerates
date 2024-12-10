const express = require("express");
const upload = require("../utils/multerHelper");
const addressController = require("../controllers/addressController");

const router = express.Router();

// Create Item
router.post("/", addressController.create);
router.patch("/:id", addressController.update);
router.get("/:id", addressController.getById);
router.get("/", addressController.getAll);
router.delete("/:id", addressController.delete);

module.exports = router;
