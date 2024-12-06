// dashboardController.js
const User = require("../models/User");
const Course = require("../models/Course");
const StudySession = require("../models/StudySession");
const jwt = require("jsonwebtoken");
const ChatConversation = require("../models/ChatConversation");
const catchAsync = require("../utils/catchAsync");

const RASA_URL = process.env.RASA_URL || "http://localhost:5005";

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

exports.getDashboardData = catchAsync(async (req, res) => {
  const userId = req.user._id;

  // Fetch user's courses
  const courses = await Course.find({ user: userId })
    .select('title description professor startDate endDate schedule category tags milestones progress')
    .sort({ startDate: 1 });

  // Fetch user's study sessions
  const studySessions = await StudySession.find({ user: userId })
    .sort({ startTime: -1 })
    .limit(10);

  // Calculate upcoming tasks from milestones
  const tasks = [];
  const now = new Date();
  const oneWeekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  courses.forEach(course => {
    course.milestones?.forEach(milestone => {
      if (!milestone.completed && new Date(milestone.dueDate) <= oneWeekFromNow) {
        tasks.push({
          title: milestone.title,
          course: course.title,
          due: milestone.dueDate,
        });
      }
    });
  });

  // Sort tasks by due date
  tasks.sort((a, b) => new Date(a.due) - new Date(b.due));

  // Include recent chat history
  const recentChats = await ChatConversation.findOne({ user: userId })
    .select('messages')
    .sort({ 'messages.timestamp': -1 })
    .limit(5);

  res.status(200).json({
    status: "success",
    data: {
      user: {
        name: req.user.name,
        email: req.user.email,
      },
      courses,
      tasks,
      studySessions,
      recentChats: recentChats?.messages || []
    },
  });
});

exports.handleChatMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user._id;

    // Find or create conversation
    let conversation = await ChatConversation.findOne({ user: userId });
    if (!conversation) {
      conversation = new ChatConversation({ user: userId });
    }

    // Add user message
    conversation.messages.push({
      content: message,
      type: "user",
    });

    // Get response from Rasa with user context
    const rasaResponse = await axios.post(`${RASA_URL}/webhooks/rest/webhook`, {
      sender: userId.toString(),
      message,
      metadata: {
        userId: userId.toString(),
        userName: req.user.name
      }
    });

    // Add bot responses
    const botResponses = rasaResponse.data;
    botResponses.forEach((response) => {
      conversation.messages.push({
        content: response.text,
        type: "bot",
      });
    });

    conversation.lastInteraction = new Date();
    await conversation.save();

    res.json({
      status: "success",
      data: botResponses,
    });
  } catch (error) {
    console.error("Chat Error:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const conversation = await ChatConversation.findOne({ user: req.user._id })
      .select('messages')
      .sort({ 'messages.timestamp': -1 });

    res.json({
      status: "success",
      data: conversation?.messages || []
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message
    });
  }
};


