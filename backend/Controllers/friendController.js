const Friend = require("../Model/Friend");
const User = require("../Model/User");

const sendFriendRequest = async (req, res) => {
  try {
    const { senderId, receiverId } = req.body;

    if (senderId === receiverId) {
      return res.status(400).json({
        success: false,
        message: "You cannot send a friend request to yourself.",
      });
    }

    const sender = await User.findById(senderId);
    const receiver = await User.findById(receiverId);

    if (!sender || !receiver) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const existing = await Friend.findOne({
      $or: [
        { sender: senderId, receiver: receiverId },
        { sender: receiverId, receiver: senderId },
      ],
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Friend request already exists.",
      });
    }

    const request = await Friend.create({
      sender: senderId,
      receiver: receiverId,
    });

    res.status(201).json({
      success: true,
      message: "Friend request sent successfully.",
      request,
    });
  } catch (error) {
    console.error("Send Friend Request Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Friend.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Friend request not found.",
      });
    }

    if (request.status === "accepted") {
      return res.status(400).json({
        success: false,
        message: "Friend request already accepted.",
      });
    }

    request.status = "accepted";
    await request.save();

    res.status(200).json({
      success: true,
      message: "Friend request accepted successfully.",
      request,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

const rejectFriendRequest = async(req,res) =>{
    try {
        const {requestId} = req.params

        const request = await Friend.findById(requestId)

        if(!request){
            return res.status(404).json({
                success:false,
                message:"Friend request not found.",
            })
        }

        if(request.status !== "pending"){
            return res.status(400).json({
                success:false,
                message:"This request is no longer pending.",
            })
        }

        request.status = "rejected"
        await request.save()

        return res.status(200).json({
            success:true,
            message:"Friend request rejected successfully.",
            request,
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Server Error",
        })
    }
}

module.exports = {
  sendFriendRequest,
  acceptFriendRequest,
  rejectFriendRequest,
};
