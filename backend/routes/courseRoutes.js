const express = require("express");
const { protect } = require("../controllers/authController");
const courseController = require("../controllers/courseController");

const router = express.Router();

router.use(protect);

router
  .route("/")
  .get(courseController.getCourses)
  .post(courseController.createCourse);

router
  .route("/:id")
  .patch(courseController.updateCourse)
  .delete(courseController.deleteCourse);

router
  .route("/:courseId/notes")
  .get(courseController.getNotes)
  .post(courseController.addNote);

router
  .route("/:courseId/notes/:id")
  .delete(courseController.deleteNote);

router
  .route("/:courseId/assignments")
  .get(courseController.getAssignments)
  .post(courseController.addAssignment);

router
  .route("/:courseId/assignments/:id")
  .patch(courseController.updateAssignment)
  .delete(courseController.deleteAssignment);

module.exports = router;
