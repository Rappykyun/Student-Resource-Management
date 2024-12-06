const Resource = require("../models/Resources");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

// Get all resources
exports.getAllResources = catchAsync(async (req, res, next) => {
  const resources = await Resource.find({ approved: true })
    .populate("submittedBy", "name profilePicture")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    data: {
      resources,
    },
  });
});

// Get a single resource
exports.getResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    { $inc: { views: 1 } },
    { new: true }
  ).populate("submittedBy", "name profilePicture");

  if (!resource) {
    return next(new AppError("No resource found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      resource,
    },
  });
});

// Submit a new resource
exports.submitResource = catchAsync(async (req, res, next) => {
  const newResource = await Resource.create({
    ...req.body,
    submittedBy: req.user.id,
  });

  res.status(201).json({
    status: "success",
    data: {
      resource: newResource,
    },
  });
});

// Update a resource
exports.updateResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findOneAndUpdate(
    {
      _id: req.params.id,
      submittedBy: req.user.id,
    },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!resource) {
    return next(new AppError("No resource found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      resource,
    },
  });
});

// Delete a resource
exports.deleteResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findOneAndDelete({
    _id: req.params.id,
    submittedBy: req.user.id,
  });

  if (!resource) {
    return next(new AppError("No resource found with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// Search resources
exports.searchResources = catchAsync(async (req, res, next) => {
  const { query, category, difficulty, sort } = req.query;
  const searchQuery = { approved: true };

  if (query) {
    searchQuery.$text = { $search: query };
  }

  if (category) {
    searchQuery.category = category;
  }

  if (difficulty) {
    searchQuery.difficulty = difficulty;
  }

  let sortOptions = { popularityScore: -1 };
  if (sort === "newest") {
    sortOptions = { createdAt: -1 };
  } else if (sort === "rating") {
    sortOptions = { "rating.average": -1 };
  } else if (sort === "downloads") {
    sortOptions = { downloadCount: -1 };
  }

  const resources = await Resource.find(searchQuery)
    .populate("submittedBy", "name profilePicture")
    .sort(sortOptions);

  res.status(200).json({
    status: "success",
    results: resources.length,
    data: {
      resources,
    },
  });
});

// Add a review
exports.reviewResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    return next(new AppError("No resource found with that ID", 404));
  }

  // Check if user has already reviewed
  const existingReview = resource.reviews.find(
    (review) => review.user.toString() === req.user.id
  );

  if (existingReview) {
    return next(new AppError("You have already reviewed this resource", 400));
  }

  resource.reviews.push({
    user: req.user.id,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  await resource.save();

  res.status(201).json({
    status: "success",
    data: {
      resource,
    },
  });
});

// Handle reactions (like, helpful, save)
exports.handleReaction = catchAsync(async (req, res, next) => {
  const { type } = req.body;
  const resource = await Resource.findById(req.params.id);

  if (!resource) {
    return next(new AppError("No resource found with that ID", 404));
  }

  const userId = req.user.id;
  const reactionArray = resource.reactions[type];
  const hasReacted = reactionArray.includes(userId);

  if (hasReacted) {
    // Remove reaction
    resource.reactions[type] = reactionArray.filter(
      (id) => id.toString() !== userId
    );
  } else {
    // Add reaction
    reactionArray.push(userId);
  }

  await resource.save();

  res.status(200).json({
    status: "success",
    data: {
      resource,
    },
  });
});

// Record download
exports.recordDownload = catchAsync(async (req, res, next) => {
  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    {
      $inc: { downloadCount: 1 },
      lastDownloaded: new Date(),
    },
    { new: true }
  );

  if (!resource) {
    return next(new AppError("No resource found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      resource,
    },
  });
});

// Admin routes
exports.getAllPendingResources = catchAsync(async (req, res, next) => {
  const resources = await Resource.find({ approved: false })
    .populate("submittedBy", "name profilePicture")
    .sort("-createdAt");

  res.status(200).json({
    status: "success",
    data: {
      resources,
    },
  });
});

exports.approveResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    {
      approved: true,
      approvedBy: req.user.id,
      approvedAt: new Date(),
      adminFeedback: req.body.feedback,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!resource) {
    return next(new AppError("No resource found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      resource,
    },
  });
});
