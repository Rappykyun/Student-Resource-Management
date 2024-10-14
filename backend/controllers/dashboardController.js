// dashboardController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Middleware to protect dashboard routes
exports.protect = async (req, res, next) => {
  try {
    // 1. Get the token
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        status: "fail",
        message: "You are not logged in. Please log in to get access.",
      });
    }

    // 2. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({
        status: "fail",
        message: "The user no longer exists.",
      });
    }

    // 4. Grant access to protected route
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      status: "fail",
      message: "Invalid token. Please log in again.",
    });
  }
};

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const dashboardData = {
      courses: [
        { id: 1, name: "Mathematics 101" },
        { id: 2, name: "History 202" },
        { id: 3, name: "Computer Science 303" },
      ],
      tasks: [
        { id: 1, title: "Math Assignment", due: "2024-10-15" },
        { id: 2, title: "History Essay", due: "2024-10-20" },
      ],
      studySessions: [
        { id: 1, subject: "Mathematics", time: "14:00 - 16:00" },
        { id: 2, subject: "History", time: "18:00 - 20:00" },
      ],
      resources: [
        { id: 1, title: "Calculus Textbook", type: "PDF" },
        { id: 2, title: "World War II Documentary", type: "Video" },
      ],
    };

    res.status(200).json({
      status: "success",
      data: {
        user: {
          name: req.user.name,
          email: req.user.email,
        },
        ...dashboardData,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
