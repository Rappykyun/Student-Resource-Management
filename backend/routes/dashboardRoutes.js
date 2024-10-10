const express = require("express");
const dashboardController = require("../controllers/dashboardController");

const router = express.Router();

router.use(dashboardController.protect); // Protect all dashboard routes
router.get("/data", dashboardController.getDashboardData);

module.exports = router;
