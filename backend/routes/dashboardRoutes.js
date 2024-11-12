const express = require("express");
const { protect } = require("../controllers/authController");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.use(protect);

// Dashboard data
router.get("/data", dashboardController.getDashboardData);

// Chat routes
router.post("/chat/message", dashboardController.handleChatMessage);
router.get("/chat/history", dashboardController.getChatHistory);

module.exports = router;
