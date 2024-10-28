const express = require("express");
const { protect } = require("../controllers/authController");
const profileController = require("../controllers/profileController");

const router = express.Router();

router.use(protect);
router.get("/",profileController.getProfile);
router.patch("/", profileController.updateProfile);



module.exports = router;
