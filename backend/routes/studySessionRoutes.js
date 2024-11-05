const express = require("express");
const { protect } = require("../controllers/authController");
const studySessionController = require("../controllers/studySessionController");

const router = express.Router();

router.use(protect);

router
    .route("/")
    .get(studySessionController.getSessions)
    .post(studySessionController.createSession);


router
  .route("/:id")
  .patch(studySessionController.updateSession)
  .delete(studySessionController.deleteSession);

router.route("/:id/progress").patch(studySessionController.updateProgress);

router.route("/stats").get(studySessionController.getStudyStats);

module.exports = router;