const express = require("express");
const router = express.Router();

const upload = require("../Middleware/publicUpload");

const {
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
} = require("../Controllers/postController");

router.post("/create", upload.single("media"), createPost);
router.get("/", getAllPosts);
router.get("/shared/:postId", getSharedPosts);
router.get("/:postId", getSinglePost);
router.delete("/:postId", deletePost);
router.put("/:postId", editPost);
router.put("/:postId/like", likeUnlikePost);
router.post("/:postId/comment", addComment);
router.get("/:postId/comments", getComment);
router.delete("/:postId/comment/:commentId", deleteComment);
router.post("/:postId/share", sharePost);


module.exports = router;
