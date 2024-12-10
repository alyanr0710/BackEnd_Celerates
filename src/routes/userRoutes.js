const express = require("express");
const userController = require("../controllers/userController");
const authMiddleware = require("../utils/authMiddleware");

const router = express.Router();

router.patch("/update", authMiddleware, userController.updateProfile);
router.patch("/update-image", authMiddleware, userController.updateProfileImage);
router.get("/profile", authMiddleware, userController.getProfileWithImage);
router.patch("/update-password", authMiddleware, userController.updatePassword);
router.delete("/delete", authMiddleware, userController.deleteProfile);
router.patch("/reset-password", userController.resetPassword);
router.post("/cek-otp", userController.cekOtp);
router.post("/cek-email", userController.cekEmail);

module.exports = router;
