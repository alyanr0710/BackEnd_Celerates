const express = require("express");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.post("/", cartController.addToCart);
router.get("/", cartController.getCart);
router.patch("/update", cartController.updateCartItemQty);
router.delete("/delete/:cartItemId", cartController.deleteCartItem);

module.exports = router;

