const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      email: req.body.email,
      profilePicture: req.body.profilePicture,
      bio: req.body.bio,
      phoneNumber: req.body.phoneNumber,
      studentId: req.body.studentId,
    };

    const user = await User.findByIdAndUpdate(req.user._id, updates, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: "success",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          profilePicture: user.profilePicture,
          bio: user.bio,
          phoneNumber: user.phoneNumber,
          studentId: user.studentId,
        },
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
