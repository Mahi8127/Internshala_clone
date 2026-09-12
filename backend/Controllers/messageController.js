const Message = require("../Model/Message");
const User = require("../Model/User");
const mongoose = require("mongoose");

// ======================================================
// SEND MESSAGE
// ======================================================

const sendMessage = async (req, res) => {
  try {
    const {
      sender,
      receiver,
      text,
      messageType,
      sharedPost,
    } = req.body;

    if (!sender || !receiver) {
      return res.status(400).json({
        success: false,
        message: "Sender and receiver are required.",
      });
    }

    // ==================================================
    // NORMAL TEXT MESSAGE
    // ==================================================

    if (!messageType || messageType === "text") {
      const message = await Message.create({
        sender,
        receiver,
        text: text || "",
        messageType: "text",
        sharedPost: null,

        // IMPORTANT:
        // Every new message starts as unread
        isRead: false,
      });

      const populatedMessage = await Message.findById(
        message._id
      )
        .populate(
          "sender",
          "name email photo"
        )
        .populate(
          "receiver",
          "name email photo"
        );

      return res.status(201).json({
        success: true,
        message: "Message sent successfully.",
        data: populatedMessage,
      });
    }

    // ==================================================
    // SHARED POST MESSAGE
    // ==================================================

    if (messageType === "post") {
      if (!sharedPost) {
        return res.status(400).json({
          success: false,
          message: "sharedPost is required for post messages.",
        });
      }

      // Validate post ID
      if (!mongoose.Types.ObjectId.isValid(sharedPost)) {
        return res.status(400).json({
          success: false,
          message: "Invalid sharedPost ID.",
        });
      }

      const message = await Message.create({
        sender,
        receiver,

        // Post messages don't need normal text
        text: "",

        messageType: "post",

        sharedPost,

        // IMPORTANT:
        // Shared post is also unread for receiver
        isRead: false,
      });

      const populatedMessage = await Message.findById(
        message._id
      )
        .populate(
          "sender",
          "name email photo"
        )
        .populate(
          "receiver",
          "name email photo"
        )
        .populate({
          path: "sharedPost",
          populate: {
            path: "user",
            select: "name email photo",
          },
        });

      return res.status(201).json({
        success: true,
        message: "Post shared successfully.",
        data: populatedMessage,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid message type.",
    });
  } catch (error) {
    console.error("SEND MESSAGE ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET CONVERSATION
// ======================================================

const getConversation = async (req, res) => {
  try {
    const {
      userId,
      otherUserId,
    } = req.params;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!userId || !otherUserId) {
      return res.status(400).json({
        success: false,
        message: "Both user IDs are required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(otherUserId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    // --------------------------------------------------
    // FETCH MESSAGES
    // --------------------------------------------------

    const messages = await Message.find({
      $or: [
        {
          sender: userId,
          receiver: otherUserId,
        },
        {
          sender: otherUserId,
          receiver: userId,
        },
      ],
    })
      .populate(
        "sender",
        "name email photo"
      )
      .populate(
        "receiver",
        "name email photo"
      )
      .populate({
        path: "sharedPost",
        populate: {
          path: "user",
          select: "name email photo",
        },
      })
      .sort({
        createdAt: 1,
      });

    return res.status(200).json({
      success: true,
      count: messages.length,
      message: messages,
    });
  } catch (error) {
    console.error("GET CONVERSATION ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// GET ALL CONVERSATIONS
// ======================================================

const getConversations = async (req, res) => {
  try {
    const { userId } = req.params;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User ID is required.",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    // --------------------------------------------------
    // FETCH ALL MESSAGES
    // --------------------------------------------------

    const messages = await Message.find({
      $or: [
        {
          sender: userId,
        },
        {
          receiver: userId,
        },
      ],
    })
      .populate(
        "sender",
        "name email photo"
      )
      .populate(
        "receiver",
        "name email photo"
      )
      .populate({
        path: "sharedPost",
        populate: {
          path: "user",
          select: "name email photo",
        },
      })
      .sort({
        createdAt: -1,
      });

    // --------------------------------------------------
    // BUILD CONVERSATION LIST
    // --------------------------------------------------

    const conversation = [];
    const seenUsers = new Set();

    for (const message of messages) {
      if (!message.sender || !message.receiver) {
        continue;
      }

      const otherUser =
        String(message.sender._id) === String(userId)
          ? message.receiver
          : message.sender;

      if (!otherUser?._id) {
        continue;
      }

      const otherUserId =
        String(otherUser._id);

      // Only one conversation entry per user
      if (seenUsers.has(otherUserId)) {
        continue;
      }

      seenUsers.add(otherUserId);

      // ------------------------------------------------
      // UNREAD COUNT
      // ------------------------------------------------
      //
      // Count messages:
      //
      // otherUser -> currentUser
      //
      // that are NOT read.
      //
      // $ne:true also catches old messages where
      // isRead doesn't exist in MongoDB.
      //

      const unreadCount =
        await Message.countDocuments({
          sender: otherUserId,
          receiver: userId,
          isRead: {
            $ne: true,
          },
        });

      conversation.push({
        user: otherUser,

        lastMessage: message,

        unreadCount: unreadCount,
      });
    }

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    console.error(
      "GET CONVERSATIONS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// MARK MESSAGES AS READ
// ======================================================

const markMessageAsRead = async (
  req,
  res
) => {
  try {
    const {
      userId,
      otherUserId,
    } = req.params;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!userId || !otherUserId) {
      return res.status(400).json({
        success: false,
        message: "Both user IDs are required.",
      });
    }

    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(otherUserId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID.",
      });
    }

    // --------------------------------------------------
    // MARK ONLY THEIR MESSAGES AS READ
    // --------------------------------------------------

    const result =
      await Message.updateMany(
        {
          sender: otherUserId,
          receiver: userId,

          isRead: {
            $ne: true,
          },
        },
        {
          $set: {
            isRead: true,
          },
        }
      );

    console.log(
      "MARK READ:",
      {
        currentUser: userId,
        otherUser: otherUserId,
        modifiedCount:
          result.modifiedCount,
      }
    );

    return res.status(200).json({
      success: true,
      message: "Messages marked as read.",
      modifiedCount:
        result.modifiedCount,
    });
  } catch (error) {
    console.error(
      "MARK READ ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// SEARCH USERS
// ======================================================

const searchUsers = async (
  req,
  res
) => {
  try {
    const {
      query,
      userId,
    } = req.query;

    // --------------------------------------------------
    // VALIDATE USER ID
    // --------------------------------------------------

    if (
      !userId ||
      !mongoose.Types.ObjectId.isValid(userId)
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid userId is required.",
      });
    }

    // --------------------------------------------------
    // EMPTY SEARCH
    // --------------------------------------------------

    if (
      !query ||
      !query.trim()
    ) {
      return res.status(200).json({
        success: true,
        users: [],
      });
    }

    // --------------------------------------------------
    // SEARCH
    // --------------------------------------------------

    const users =
      await User.find({
        _id: {
          $ne: userId,
        },

        $or: [
          {
            name: {
              $regex: query.trim(),
              $options: "i",
            },
          },
          {
            email: {
              $regex: query.trim(),
              $options: "i",
            },
          },
        ],
      })
        .select(
          "_id name email photo"
        )
        .limit(20);

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error(
      "SEARCH USERS ERROR:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

module.exports = {
  sendMessage,
  getConversation,
  getConversations,
  markMessageAsRead,
  searchUsers,
};