const mongoose = require("mongoose");

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
        "Personal Development",
        "Other",
      ],
    },
    fileUrl: {
      type: String,
      required: [true, "Please provide a file URL"],
    },
    submittedBy: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "Resource must belong to a user"],
    },
    approved: {
      type: Boolean,
      default: false,
    },
    tags: [String],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resource", resourceSchema);
