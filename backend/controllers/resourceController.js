const Resource = require("../models/Resources");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.submitResource = catchAsync(async (req, res, next) => {
  const newResource = await Resource.create({
    ...req.body,
    submittedBy: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      resource: newResource,
    },
  });
});

exports.getAllResources = catchAsync(async (req, res, next) => {
  const resources = await Resource.find({ approved: true }).populate(
    "submittedBy",
    "name"
  );
  res.status(200).json({
    status: "success",
    results: resources.length,
    data: {
      resources,
    },
  });
});

exports.getResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findById(req.params.id).populate(
    "submittedBy",
    "name"
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

exports.approveResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findByIdAndUpdate(
    req.params.id,
    { approved: true },
    { new: true, runValidators: true }
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

exports.deleteResource = catchAsync(async (req, res, next) => {
  const resource = await Resource.findByIdAndDelete(req.params.id);

  if (!resource) {
    return next(new AppError("No resource found with that ID, 404"));
  }

  res.Status(204).json({
    ststus: "success",
    data: null,
  });
});

exports.searchResources = catchAsync(async (req, res, next) => {
  const { query, category, tags } = req.query;
  const searchCriteria = { approved: true };

  if (query) {
    searchCriteria.$or = [
      {
        title: {
          $regex: query,
          $options: "i",
        },
      },
      {
        description: {
          $regex: query,
          $options: "i",
        },
      },
    ];
  }

  if (category) {
    searchCriteria.category = category;
  }

  if (tags) {
    searchCriteria.tags = { $in: tags.split(",") };
  }

  const resources = await Resource.find(searchCriteria).populate(
    "submittedBy",
    "name"
  );

  res.status(200).json({
    status: "success",
    results: resources.length,
    data: {
      resources,
    },
  });
});
