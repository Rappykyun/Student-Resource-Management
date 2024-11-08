const express = require("express");
const router = express.Router();
const { protect } = require("../controllers/authController");
const {
  getNotifications,
  markAsRead,
} = require("../controllers/notificationController");

router.get("/", protect, getNotifications);
router.put("/mark-read", protect, markAsRead);

module.exports = router;
