const StudySession = require("../models/studySessionModel");
const Course = require("../models/Course");
const { sendNotification } = require("../utils/sendNotification");
const { catchError } = require("rxjs");

exports.createSession = async (req, res) => {
  try {
    const newSession = await StudySession.create({
      ...req.body,
      user: req.user._id,
    });
    if (newSession.recurring.enabled) {
      await createRecurringSessions(newSession);
    }
    if (newSession.remainder.enabled) {
      scheduleRemainder(newSession);
    }
    res.status(201).json({
      status: "success",
      data: { session: newSession },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getSessions = async (req, res) => {
  try {
    const filter = {
      user: req.user._id,
    };

    if (req.query.startDate && req.query.endDate) {
      filter.startTime = {
        $gte: new Date(req.query.startDate),
        $lte: new Date(req.query.endDate),
      };
    }

    if (req.query.course) {
      filter.course = req.query.course;
    }

    if (req.query.category) {
      filter.category = req.query.category;
    }

    const sessions = await StudySession.find(filter)
      .populate("course", "title professor")
      .sort({ startTime: 1 });

    res.status(200).json({
      status: "success",
      data: { sessions },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateSession = async (req, res) => {
  try {
    const session = await StudySession.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!session) {
      return res.status(404).json({
        status: "fail",
        message: "Study session not found",
      });
    }

    if (session.remainder.enabled) {
      scheduleRemainder(session);
    }

    res.status(200).json({
      status: "success",
      data: { session },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateProgress = async (req, res) => {
  try {
    const session = await StudySession.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({
        status: "fail",
        message: "Study session not found",
      });
    }

    session.progress = {
      ...session.progress,
      ...req.body,
      completedAt:
        req.body.status === "completed"
          ? new Date()
          : session.progress.completedAt,
    };

    await session.save();

    res.status(200).json({
      status: "success",
      data: { session },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getStudyStats = async (req, res) => {
  try {
    const stats = await StudySession.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: "$category",
          totalSessions: { $sum: 1 },
          completedSessions: {
            $sum: [{ $eq: ["$progress.status", "completed"] }, 1, 0],
          },
        },
        totalDuration: { $sum: "$progress.duration" },
        avgDuration: { $avg: "$progress.duration" },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: { stats },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

async function createRecurringSessions(baseSession) {
  const sessions = [];
  let currentDate = new Date(baseSession.startTime);
  const endDate = new Date(baseSession.recurring.endDate);

  while (currentDate <= endDate) {
    const sessionData = {
      ...baseSession.toObject(),
      _id: undefined,
      startTime: new Date(currentDate),
      endTime: new Date(
        currentDate.getTime() + (baseSession.endTime - baseSession.startTime)
      ),
    };
    sessions.push(sessionData);

    switch (baseSession.recurring.frequency) {
      case "daily":
        currentDate.setDate(currentDate.getDate() + 1);
        break;
      case "weekly":
        currentDate.setDate(currentDate.getDate() + 7);
        break;
      case "monthly":
        currentDate.setMonth(currentDate.getMonth() + 1);
    }
  }

  await StudySession.insertMany(sessions);
}

function scheduleReminder(session) {
  const reminderTime = new Date(session.startTime);
  reminderTime.setMinutes(reminderTime.getMinutes() - session.reminder.time);

  const delay = reminderTime.getTime() - Date.now();
  if (delay > 0) {
    setTimeout(async () => {
      await sendNotification(session.user, {
        title: "Study Session Reminder",
        message: `Your ${session.category} session "${session.title}" starts in ${session.remainder.time} minutes`,
        type: "study_remainder",
        sessionId: session._id,
      });
    }, delay);
  }
}
