const express = require("express");
const upload = require("../utils/multerHelper");
const categoryController = require("../controllers/categoryController");

const router = express.Router();

// Create Item
router.get("/", categoryController.getAll);
module.exports = router;
