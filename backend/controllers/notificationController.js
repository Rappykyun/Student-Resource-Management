const Notification = require("../models/Notification");

exports.getNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id })
      .sort({ createdAt: -1 })
      .limit(10);
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error fetching notifications" });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      {
        userId: req.user._id,
        read: false,
      },
      {
        read: true,
      }
    );
    res.status(200).json({ success: true });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Error marking notifications as read" });
  }
};

exports.createNotification = async (userId, message, type) => {
  try {
    const notification = new Notification({
      userId,
      message,
      type,
    });
    await notification.save();
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    return null;
  }
};
