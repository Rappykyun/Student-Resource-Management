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
  likes: [{
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }],
  helpful: [{
    type: mongoose.Schema.ObjectId,
    ref: "User"
  }]
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
        "frontend",
        "backend",
        "devOps",
        "design",
        "data Structures",
        "algorithms",
        "system Design",
        "database",
        "security",
        "machine Learning",
        "cloud Computing",
        "other",
      ],
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["beginner", "intermediate", "advanced"],
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
    imageUrl: {
      type: String,
      default: "", // Default preview image URL
    },
    thumbnailUrl: {
      type: String,
      default: "", // Smaller thumbnail for cards
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
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
      distribution: {
        1: { type: Number, default: 0 },
        2: { type: Number, default: 0 },
        3: { type: Number, default: 0 },
        4: { type: Number, default: 0 },
        5: { type: Number, default: 0 },
      }
    },
    reactions: {
      likes: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
      }],
      helpful: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
      }],
      saved: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
      }]
    },
    views: {
      type: Number,
      default: 0,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
    lastDownloaded: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes for better query performance
resourceSchema.index({ title: "text", description: "text", topics: "text" });
resourceSchema.index({ category: 1, difficulty: 1, approved: 1 });
resourceSchema.index({ tags: 1 });
resourceSchema.index({ "rating.average": -1 });
resourceSchema.index({ views: -1 });
resourceSchema.index({ downloadCount: -1 });

// Calculate average rating when a review is added or modified
resourceSchema.pre("save", function(next) {
  if (this.reviews.length > 0) {
    const totalRating = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating.average = totalRating / this.reviews.length;
    this.rating.count = this.reviews.length;
    
    // Update rating distribution
    this.rating.distribution = {
      1: this.reviews.filter(r => r.rating === 1).length,
      2: this.reviews.filter(r => r.rating === 2).length,
      3: this.reviews.filter(r => r.rating === 3).length,
      4: this.reviews.filter(r => r.rating === 4).length,
      5: this.reviews.filter(r => r.rating === 5).length,
    };
  }
  next();
});

// Virtual for popularity score
resourceSchema.virtual("popularityScore").get(function() {
  const viewWeight = 0.3;
  const downloadWeight = 0.3;
  const ratingWeight = 0.4;
  
  return (
    (this.views * viewWeight) +
    (this.downloadCount * downloadWeight) +
    (this.rating.average * this.rating.count * ratingWeight)
  );
});

module.exports = mongoose.model("Resource", resourceSchema);
