const Course = require("../models/Course");
const Note = require("../models/Note");
const Assignment = require("../models/Assignment");


exports.createCourse = async (req, res) => {
  try {
    const newCourse = await Course.create({ ...req.body, user: req.user._id });
    res.status(201).json({ status: "success", data: { course: newCourse } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.getCourses = async (req, res) => {
  try {
    const courses = await Course.find({ user: req.user._id });
    res.status(200).json({ status: "success", data: { courses } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!course) {
      return res
        .status(404)
        .json({ status: "fail", message: "Course not found" });
    }
    res.status(200).json({ status: "success", data: { course } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!course) {
      return res
        .status(404)
        .json({ status: "fail", message: "Course not found" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.addNote = async (req, res) => {
  try {
    const newNote = await Note.create({
      ...req.body,
      course: req.params.courseId,
      user: req.user._id,
    });
    res.status(201).json({ status: "success", data: { note: newNote } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      course: req.params.courseId,
      user: req.user._id,
    });
    res.status(200).json({ status: "success", data: { notes } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
exports.updateNote = async (req, res) => {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!note) {
      return res
        .status(404)
        .json({ status: "fail", message: "Note not found" });
    }
    res.status(200).json({ status: "success", data: { note } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};  

exports.deleteNote = async (req, res) => {
  try {
    await Note.findOneAndDelete({ _id: req.params.id, user: req.user._id
    })
  } catch (error) {
    
  }
}

exports.addAssignment = async (req, res) => {
  try {
    const newAssignment = await Assignment.create({
      ...req.body,
      course: req.params.courseId,
      user: req.user._id,
    });
    res
      .status(201)
      .json({ status: "success", data: { assignment: newAssignment } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.getAssignments = async (req, res) => {
  try {
    const assignments = await Assignment.find({
      course: req.params.courseId,
      user: req.user._id,
    });
    res.status(200).json({ status: "success", data: { assignments } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};

exports.updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!assignment) {
      return res
        .status(404)
        .json({ status: "fail", message: "Assignment not found" });
    }
    res.status(200).json({ status: "success", data: { assignment } });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!assignment) {
      return res
        .status(404)
        .json({ status: "fail", message: "Assignment not found" });
    }
    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    res.status(400).json({ status: "fail", message: error.message });
  }
};
