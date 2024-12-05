const mongoose = require("mongoose");

const syllabusItemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  fileUrl: { type: String },
  weekNumber: { type: Number },
});

const milestoneSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  completed: { type: Boolean, default: false },
});

const studySessionSchema = new mongoose.Schema({
  date: { type: Date, default: Date.now },
  duration: { type: Number }, // in minutes
  topic: { type: String },
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  professor: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  schedule: { type: String },
  category: { type: String },
  tags: [{ type: String }],
  syllabus: [syllabusItemSchema],
  milestones: [milestoneSchema],
  progress: {
    completedMilestones: { type: Number, default: 0 },
    totalMilestones: { type: Number, default: 0 },
    lastStudySession: { type: Date },
    totalStudyTime: { type: Number, default: 0 }, // in minutes
  },
  studySessions: [studySessionSchema],
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, {
  timestamps: true,
});

// Calculate course progress
courseSchema.methods.calculateProgress = function() {
  if (this.milestones.length === 0) return 0;
  return (this.milestones.filter(m => m.completed).length / this.milestones.length) * 100;
};

// Add study session
courseSchema.methods.addStudySession = function(duration, topic) {
  this.studySessions.push({ duration, topic });
  this.progress.totalStudyTime += duration;
  this.progress.lastStudySession = new Date();
};

module.exports = mongoose.model("Course", courseSchema);
