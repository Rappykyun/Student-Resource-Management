const express = require("express");
const { protect } = require("../controllers/authController");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.use(protect);
router.patch("/update", profileController.updateProfile);

module.exports = router;
