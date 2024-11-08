const mongoose = require("mongoose");

const studySessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
  },
  category: {
    type: String,
    enum: ["exam_prep", "homework", "reading", "review", "practice"],
    required: true,
  },
  startTime: {
    type: Date,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  description: String,
  recurring: {
    enabled: {
      type: Boolean,
      Default: false,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly"],
      required: function () {
        return this.recurring.enabled;
      },
    },
    endDate: {
      type: Date,
      required: function () {
        return this.recurring.enabled;
      },
    },
  },
  remainder: {
    enabled: {
      type: Boolean,
      default: false,
    },
    time: {
      type: Number,
      default: 30,
      required: function () {
        return this.remainder.enabled;
      },
    },
  },
  progress: {
    status: {
      type: String,
      enum: ["not_started", "in_progress", "completed", "missed"],
      default: "not_started",
    },
    completedAt: Date,
    duration: Number,
    notes: String,
  },
});

module.exports = mongoose.model("StudySession", studySessionSchema);
