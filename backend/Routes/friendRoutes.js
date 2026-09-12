const express = require("express");
const router = express.Router();

const {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
} = require("../Controllers/friendController");

router.post("/send-request", sendFriendRequest);
router.post("/accept-request/:requestId", acceptFriendRequest);
router.put("/reject-request/:requestId", rejectFriendRequest);

module.exports = router;
