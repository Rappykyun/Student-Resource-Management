const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictToAdmin } = require("../middleware/adminMiddleware");
const resourceController = require("../controllers/resourceController");

const router = express.Router();

router.use(protect);

// Public routes
router
  .route("/")
  .get(resourceController.getAllResources)
  .post(resourceController.submitResource);

router.get("/search", resourceController.searchResources);
router.post("/:id/reviews", resourceController.reviewResource);

// Admin routes
router.use(restrictToAdmin);
router.get("/admin/pending", resourceController.getAllPendingResources);
router.patch("/admin/:id/approve", resourceController.approveResource);

module.exports = router;
