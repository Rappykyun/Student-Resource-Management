const express = require("express");
const { protect } = require("../controllers/authController");
const { restrictToAdmin } = require("../middleware/adminMidlleWare");
const resourceController = require("../controllers/resourceController");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(resourceController.getAllResources)
  .post(resourceController.submitResource);

router.get("/search", resourceController.searchResources);
router.post("/:id/reviews", resourceController.reviewResource);

router
  .route("/:id")
  .get(resourceController.getResource)
  .patch(resourceController.updateResource)
  .delete(resourceController.deleteResource);

router.use(restrictToAdmin);
router.get("/admin/pending", resourceController.getAllPendingResources);
router.patch("/admin/:id/approve", resourceController.approveResource);

module.exports = router;
