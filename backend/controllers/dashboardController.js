// dashboardController.js
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ChatConversation = require("../models/ChatConversation");
const axios = require("axios");

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

exports.getDashboardData = async (req, res) => {
  try {
    const userId = req.user._id;

    const dashboardData = {
      courses: [
        { id: 1, name: "Javascipt Bootcamp" },
        { id: 2, name: "Machine Learning Course" },
        { id: 3, name: "Harvard CS50" },
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

    // Include recent chat history in dashboard data
    const recentChats = await ChatConversation.findOne({ user: req.user._id })
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
        ...dashboardData,
        recentChats: recentChats?.messages || []
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

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


