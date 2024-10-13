const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  professor: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date },
  schedule: { type: String },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

module.exports = mongoose.model("Course", courseSchema);
