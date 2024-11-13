const express = require("express");
const { protect } = require("../controllers/authController");
const chatbotController = require("../controllers/chatbotController");

const router = express.Router();

router.use(protect);

router.post("/message", chatbotController.handleMessage);
router.get("/context", chatbotController.getUserContext);

module.exports = router;
