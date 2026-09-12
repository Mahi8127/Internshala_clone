const Post = require("../Model/Post");
const Friend = require("../Model/Friend");
const User = require("../Model/User");

const createPost = async (req, res) => {
  try {
    const { userId, caption } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image or video.",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const friendCount = await Friend.countDocuments({
      status: "accepted",
      $or: [{ sender: userId }, { receiver: userId }],
    });

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const todayPosts = await Post.countDocuments({
      user: userId,
      createdAt: {
        $gte: start,
        $lte: end,
      },
    });

    if (friendCount === 0) {
      return res.status(400).json({
        success: false,
        message: "You need at least one friend before posting.",
      });
    }

    if (friendCount === 1 && todayPosts >= 1) {
      return res.status(400).json({
        success: false,
        message: "Daily limit reached (1 post).",
      });
    }

    if (friendCount === 2 && todayPosts >= 2) {
      return res.status(400).json({
        success: false,
        message: "Daily limit reached (2 post).",
      });
    }

    let mediaType = "image";

    if (req.file.mimetype.startsWith("video/")) {
      mediaType = "video";
    }

    const post = await Post.create({
      user: userId,
      caption,
      media: [req.file.filename],
      mediaType,
    });

    return res.status(201).json({
      success: true,
      message: "Post created successfully",
      post,
    });
  } catch (error) {
    console.error("Create Post Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email profilePhoto")
      .populate("comments.user", "name email profilePhoto")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get All Posts Error: ", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId)
      .populate("user", "name email profilePhoto")
      .populate("comments.user", "name email profilePhoto");

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      post,
    });
  } catch (error) {
    console.error("Get Single Post Error: ", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own posts.",
      });
    }

    await Post.findByIdAndDelete(postId);

    return res.status(200).json({
      success: true,
      message: "Post delete successfully.",
    });
  } catch (error) {
    console.error("Delete Post Error: ", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const editPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, caption } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    if (post.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own posts.",
      });
    }

    post.caption = caption;
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post updated successfully.",
      post,
    });
  } catch (error) {
    console.error("Edit Post Error: ", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const likeUnlikePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const alreadyLiked = post.likes.some((id) => id.toString() === userId);

    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);

      await post.save();

      return res.status(200).json({
        success: true,
        message: "Post unliked successfully.",
        liked: false,
        likeCount: post.likes.length,
      });
    }

    post.likes.push(userId);

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post liked successfully.",
      liked: true,
      likeCount: post.likes.length,
    });
  } catch (error) {
    console.error("Like/Unlike Error: ", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty.",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    post.comments.push({
      user: userId,
      text: text.trim(),
    });

    await post.save();

    const newComment = post.comments[post.comments.length - 1];

    return res.status(201).json({
      success: true,
      message: "Comment added successfully.",
      comment: newComment,
    });
  } catch (error) {
    console.error("Add Comment Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getComment = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate(
      "comments.user",
      "name email profilePhoto",
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    return res.status(200).json({
      success: true,
      count: post.comments.length,
      comments: post.comments,
    });
  } catch (error) {
    console.error("Get Comments Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const comment = post.comments.id(commentId);

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: "Comment not found.",
      });
    }

    if (comment.user.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own comment.",
      });
    }

    comment.deleteOne();
    await post.save();

    return res.status(200).json({
      success: true,
      message: "Comment deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Comment Error: ", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const sharePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, sharedTo } = req.body;

    if (!userId || !sharedTo) {
      return res.status(400).json({
        success: false,
        message: "userId and sharedTo are required",
      });
    }

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found.",
      });
    }

    const sender = await User.findById(userId);
    const receiver = await User.findById(sharedTo);

    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    post.shares.push({
      user: userId,
      sharedTo: sharedTo,
    });

    await post.save();

    return res.status(200).json({
      success: true,
      message: "Post shared successfully.",
      shareCount: post.shares.length,
    });
  } catch (error) {
    console.error("Share Post Error: ", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSharedPosts = async (req, res) => {
  try {
    const { userId } = req.params;

    const posts = await Post.find({
      "shares.sharedTo": userId,
    })
      .populate("user", "name email photo")
      .populate("shares.user", "name email photo")
      .populate("shares.sharedTo", "name email photo")
      .populate("comments.user", "name email photo")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: posts.length,
      posts,
    });
  } catch (error) {
    console.error("Get Shared Posts Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  deletePost,
  editPost,
  likeUnlikePost,
  addComment,
  getComment,
  deleteComment,
  sharePost,
  getSharedPosts,
};
