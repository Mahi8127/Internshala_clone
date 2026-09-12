const express = require("express");

const router = express.Router();

const {
  sendMessage,
  getConversation,
  getConversations,
  markMessageAsRead,
  searchUsers,
} = require("../Controllers/messageController");

// Send message
router.post("/send", sendMessage);

// Search users
router.get("/search-users", searchUsers);

// Get conversation list + unread counts
router.get("/conversations/:userId", getConversations);

// Get messages between two users
router.get("/:userId/:otherUserId", getConversation);

// Mark messages from other user as read
router.put("/read/:userId/:otherUserId", markMessageAsRead);

module.exports = router;