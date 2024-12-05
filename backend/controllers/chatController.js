const ChatConversation = require("../models/ChatConversation");
const axios = require("axios");

const RASA_URL = process.env.RASA_URL;

exports.sendMessage = async (req, res) => {
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

    // Get response from Rasa
    const rasaResponse = await axios.post(`${RASA_URL}/webhooks/rest/webhook`, {
      sender: userId.toString(),
      message,
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

exports.getConversationHistory = async (req, res) => {
  try {
    const conversation = await ChatConversation.findOne({ user: req.user._id });
    res.json({
      status: "success",
      data: conversation?.messages || [],
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};
