const Course = require("../models/Course");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getAllCourses = catchAsync(async (req, res, next) => {
  const courses = await Course.find({ user: req.user.id });
  res.status(200).json({
    status: "success",
    data: {
      courses,
    },
  });
});

exports.getCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findOne({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!course) {
    return next(new AppError("No course found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      course,
    },
  });
});

exports.createCourse = catchAsync(async (req, res, next) => {
  const newCourse = await Course.create({
    ...req.body,
    user: req.user.id,
    progress: {
      completedMilestones: 0,
      totalMilestones: req.body.milestones?.length || 0,
      totalStudyTime: 0,
    },
  });

  res.status(201).json({
    status: "success",
    data: {
      course: newCourse,
    },
  });
});

exports.updateCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findOneAndUpdate(
    { _id: req.params.id, user: req.user.id },
    {
      ...req.body,
      progress: {
        ...req.body.progress,
        totalMilestones: req.body.milestones?.length || 0,
        completedMilestones: req.body.milestones?.filter(m => m.completed).length || 0,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!course) {
    return next(new AppError("No course found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      course,
    },
  });
});

exports.deleteCourse = catchAsync(async (req, res, next) => {
  const course = await Course.findOneAndDelete({
    _id: req.params.id,
    user: req.user.id,
  });

  if (!course) {
    return next(new AppError("No course found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// New endpoints for enhanced features

exports.updateMilestone = catchAsync(async (req, res, next) => {
  const course = await Course.findOne({
    _id: req.params.courseId,
    user: req.user.id,
  });

  if (!course) {
    return next(new AppError("No course found with that ID", 404));
  }

  const milestone = course.milestones.id(req.params.milestoneId);
  if (!milestone) {
    return next(new AppError("No milestone found with that ID", 404));
  }

  milestone.completed = req.body.completed;
  course.progress.completedMilestones = course.milestones.filter(m => m.completed).length;

  await course.save();

  res.status(200).json({
    status: "success",
    data: {
      course,
    },
  });
});

exports.addStudySession = catchAsync(async (req, res, next) => {
  const course = await Course.findOne({
    _id: req.params.courseId,
    user: req.user.id,
  });

  if (!course) {
    return next(new AppError("No course found with that ID", 404));
  }

  course.addStudySession(req.body.duration, req.body.topic);
  await course.save();

  res.status(200).json({
    status: "success",
    data: {
      course,
    },
  });
});

exports.addSyllabusItem = catchAsync(async (req, res, next) => {
  const course = await Course.findOne({
    _id: req.params.courseId,
    user: req.user.id,
  });

  if (!course) {
    return next(new AppError("No course found with that ID", 404));
  }

  course.syllabus.push(req.body);
  await course.save();

  res.status(200).json({
    status: "success",
    data: {
      course,
    },
  });
});

exports.updateSyllabusItem = catchAsync(async (req, res, next) => {
  const course = await Course.findOne({
    _id: req.params.courseId,
    user: req.user.id,
  });

  if (!course) {
    return next(new AppError("No course found with that ID", 404));
  }

  const syllabusItem = course.syllabus.id(req.params.itemId);
  if (!syllabusItem) {
    return next(new AppError("No syllabus item found with that ID", 404));
  }

  Object.assign(syllabusItem, req.body);
  await course.save();

  res.status(200).json({
    status: "success",
    data: {
      course,
    },
  });
});

exports.deleteSyllabusItem = catchAsync(async (req, res, next) => {
  const course = await Course.findOne({
    _id: req.params.courseId,
    user: req.user.id,
  });

  if (!course) {
    return next(new AppError("No course found with that ID", 404));
  }

  course.syllabus.id(req.params.itemId).remove();
  await course.save();

  res.status(204).json({
    status: "success",
    data: null,
  });
});
