const express = require("express");
const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected routes
router.get("/profile", authMiddleware, authController.getProfile);
router.put("/profile", authMiddleware, authController.updateProfile);
router.put("/location", authMiddleware, authController.updateLocation);
router.put("/change-password", authMiddleware, authController.changePassword);
router.delete("/delete-account", authMiddleware, authController.deleteAccount);

module.exports = router;
