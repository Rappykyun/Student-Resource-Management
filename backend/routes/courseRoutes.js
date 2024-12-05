const express = require("express");
const { protect } = require("../controllers/authController");
const courseController = require("../controllers/courseController");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(courseController.getAllCourses)
  .post(courseController.createCourse);

router
  .route("/:id")
  .get(courseController.getCourse)
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse);

router
  .route("/:courseId/milestones/:milestoneId")
  .patch(courseController.updateMilestone);

router
  .route("/:courseId/study-sessions")
  .post(courseController.addStudySession);

router
  .route("/:courseId/syllabus")
  .post(courseController.addSyllabusItem);

router
  .route("/:courseId/syllabus/:itemId")
  .patch(courseController.updateSyllabusItem)
  .delete(courseController.deleteSyllabusItem);

module.exports = router;
