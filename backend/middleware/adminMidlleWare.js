const AppError = require("../utils/appError");

exports.restrictToAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(
      new AppError("You do not have permission to perform this action", 403)
    );
  }
  next();
};
