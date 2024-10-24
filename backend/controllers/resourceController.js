const Resource = require("../models/Resources");

exports.submitResource = async (req, res) => {
  try {
    const newResource = await Resource.create({
      ...req.body,
      submittedBy: req.user._id,
      difficulty: req.body.difficulty,
      prerequisites: req.body.prerequisites,
      learningOutcomes: req.body.learningOutcomes,
    });

    res.status(201).json({
      status: "success",
      data: { resource: newResource },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getAllResources = async (req, res) => {
  try {
    const { sort, difficulty, category, topic } = req.query;
    let query = Resource.find({ approved: true });

    // Advanced filtering
    if (difficulty) {
      query = query.find({ difficulty });
    }
    if (category) {
      query = query.find({ category });
    }
    if (topic) {
      query = query.find({ topics: topic });
    }

    // Sorting
    if (sort) {
      const sortOrder = sort.split(",").join(" ");
      query = query.sort(sortOrder);
    } else {
      query = query.sort("-createdAt");
    }

    const resources = await query.populate([
      { path: "submittedBy", select: "name expertise" },
      { path: "reviews", select: "rating comment user" },
    ]);

    res.status(200).json({
      status: "success",
      results: resources.length,
      data: { resources },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.searchResources = async (req, res) => {
  try {
    const { query, category, tags, difficulty, topic } = req.query;
    const searchCriteria = { approved: true };

    if (query) {
      searchCriteria.$or = [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { topics: { $regex: query, $options: "i" } },
        { learningOutcomes: { $regex: query, $options: "i" } },
      ];
    }

    if (category) searchCriteria.category = category;
    if (tags) searchCriteria.tags = { $in: tags.split(",") };
    if (difficulty) searchCriteria.difficulty = difficulty;
    if (topic) searchCriteria.topics = topic;

    const resources = await Resource.find(searchCriteria)
      .populate("submittedBy", "name expertise")
      .populate("reviews")
      .sort("-rating");

    res.status(200).json({
      status: "success",
      results: resources.length,
      data: { resources },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.reviewResource = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        status: "fail",
        message: "Resource not found",
      });
    }

    const review = {
      user: req.user._id,
      rating,
      comment,
      date: Date.now(),
    };

    resource.reviews.push(review);
    resource.rating = calculateAverageRating(resource.reviews);
    await resource.save();

    res.status(200).json({
      status: "success",
      data: { resource },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

// Admin controllers
exports.getAllPendingResources = async (req, res) => {
  try {
    const resources = await Resource.find({ approved: false })
      .populate("submittedBy", "name expertise")
      .sort("-createdAt");

    res.status(200).json({
      status: "success",
      results: resources.length,
      data: { resources },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.approveResource = async (req, res) => {
  try {
    const { feedback } = req.body;
    const resource = await Resource.findByIdAndUpdate(
      req.params.id,
      {
        approved: true,
        adminFeedback: feedback,
        approvedAt: Date.now(),
        approvedBy: req.user._id,
      },
      { new: true }
    );

    if (!resource) {
      return res.status(404).json({
        status: "fail",
        message: "Resource not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: { resource },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
