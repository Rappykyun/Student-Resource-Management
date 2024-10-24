const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: String,
  date: {
    type: Date,
    default: Date.now,
  },
});

const resourceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title for the resource"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a description for the resource"],
    },
    category: {
      type: String,
      required: [true, "Please specify a category"],
      enum: [
        "Frontend",
        "Backend",
        "DevOps",
        "Design",
        "Data Structures",
        "Algorithms",
        "System Design",
        "Database",
        "Security",
        "Machine Learning",
        "Cloud Computing",
        "Other",
      ],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Beginner", "Intermediate", "Advanced"],
    },
    topics: [
      {
        type: String,
        required: true,
      },
    ],
    fileUrl: {
      type: String,
      required: [true, "Please provide a file URL"],
    },
    prerequisites: [
      {
        type: String,
      },
    ],
    learningOutcomes: [
      {
        type: String,
        required: true,
      },
    ],
    submittedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    approvedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    approvedAt: Date,
    adminFeedback: String,
    tags: [String],
    reviews: [reviewSchema],
    rating: {
      type: Number,
      default: 0,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better search performance
resourceSchema.index({ title: "text", description: "text", topics: "text" });
resourceSchema.index({ category: 1, difficulty: 1, approved: 1 });
resourceSchema.index({ tags: 1 });

module.exports = mongoose.model("Resource", resourceSchema);
