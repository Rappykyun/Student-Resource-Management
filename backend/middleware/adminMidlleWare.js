exports.restrictToAdmin = (req, res, next) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({
      status: "fail",
      message: "You do not have permission to perform this action",
    });
  }
  next();
};
