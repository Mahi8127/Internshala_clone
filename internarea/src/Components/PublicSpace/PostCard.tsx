"use client";
import { selectuser } from "@/Feature/Userslice";
import {
  EllipsisVertical,
  Heart,
  MessageCircle,
  Pencil,
  Send,
  Share2,
  Trash2,
} from "lucide-react";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLanguage } from "@/context/LanguageContext";

interface PostCardProps {
  post: any;
  currentUserId: string;

  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onShare: (postId: string) => void;
  onEdit: (postId: string) => void;
  onDelete: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  currentUserId,
  onLike,
  onComment,
  onShare,
  onEdit,
  onDelete,
}) => {
  const { t } = useLanguage();
  // Current User
  const currentUser = useSelector(selectuser);

  const currentUserName = String(
    currentUser?.name ||
      currentUser?.fullname ||
      currentUser?.fullName ||
      currentUser?.username ||
      currentUser?.userName ||
      "User",
  );

  // Post User
  const postUser = post?.user || post?.createdBy || post?.author || {};
  const userName = String(
    postUser?.name ||
      postUser?.fullname ||
      postUser?.fullName ||
      postUser?.username ||
      postUser?.userName ||
      post?.name ||
      post?.username ||
      "Unknown User",
  );

  const userImage =
    postUser?.profileImage ||
    postUser?.photo ||
    postUser?.avatar ||
    postUser?.profilePhoto ||
    post?.profileImage ||
    "";

  const postUserId =
    postUser?._id || postUser?.id || post?.userId || post?.createdBy?._id || "";

  const isOwner = String(postUserId) === String(currentUserId);

  // Media
  const media = Array.isArray(post?.media) ? post.media[0] : post?.media;

  const rawMediaUrl =
    typeof media === "string" ? media : media?.url || media?.path || "";

  const mediaUrl = rawMediaUrl
    ? String(rawMediaUrl).startsWith("http")
      ? String(rawMediaUrl)
      : `http://internshala-backend-5ycp.onrender.com//uploads/public/${String(rawMediaUrl).replace(
          /^\/+/,
          "",
        )}`
    : "";

  const mediaType = typeof media === "object" ? media?.type : post?.mediaType;

  const isVideo =
    mediaType === "video" || /\.(mp4|mov|avi|mkv|webm)$/i.test(mediaUrl);

  // Date
  const formattedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleString()
    : "";

  //Likes
  const likes = Array.isArray(post?.likes) ? post.likes : [];
  const [showMenu, setShowMenu] = useState(false);

  const isLiked = likes.some((like: any) => {
    const likeUserId =
      typeof like === "string"
        ? like
        : like?._id || like?.userId || like?.user?._id;

    return String(likeUserId) === String(currentUserId);
  });

  // Comments

  const comments = Array.isArray(post?.comments) ? post.comments : [];
  const [showComment, setShowComment] = useState(true);
  const [commentText, setCommentText] = useState("");

  // Get username from content
  const getCommentUserName = (comment: any): string => {
    if (!comment) {
      return "User";
    }

    // 1. User object
    const user = comment?.user || comment?.author || comment?.createdBy || null;

    if (user && typeof user === "object") {
      const name =
        user?.name ||
        user?.fullname ||
        user?.fullName ||
        user?.username ||
        user?.userName ||
        user?.displayName;

      if (name) {
        return String(name);
      }
    }

    // 2. userId Object
    if (comment?.userId && typeof comment.userId === "object") {
      const userIdObject = comment.userId;

      const name =
        userIdObject?.name ||
        userIdObject?.fullname ||
        userIdObject?.fullName ||
        userIdObject?.username ||
        userIdObject?.userName ||
        userIdObject?.displayName;

      if (name) {
        return String(name);
      }
    }

    // 3. Direct comment fields

    const directName =
      comment?.userName ||
      comment?.username ||
      comment?.name ||
      comment?.fullname ||
      comment?.fullName ||
      comment?.displayName;
    if (directName) {
      return String(directName);
    }

    // 4.Check comment user Id
    let commentUserId = "";
    if (typeof comment?.userId === "string") {
      commentUserId = comment.userId;
    }

    if (!commentUserId && user) {
      commentUserId = user?._id || user?.id || "";
    }

    if (!commentUserId && comment?.createdBy) {
      commentUserId = comment.createdBy?._id || comment.createdBy?.id || "";
    }

    // 5. Current User
    if (
      commentUserId &&
      currentUserId &&
      String(commentUserId) === String(currentUserId)
    ) {
      return currentUserName;
    }
    return "User";
  };

  // Get comment Avtar
  const getCommentUserImage = (comment: any): string => {
    if (!comment) {
      return "";
    }

    const user = comment?.user || comment?.author || comment?.createdBy || null;

    if (user && typeof user === "object") {
      return String(
        user?.profileImage ||
          user?.photo ||
          user?.avatar ||
          user?.profilePhoto ||
          "",
      );
    }

    if (comment?.userId && typeof comment.userId === "object") {
      return String(
        comment.userId?.profileImage ||
          comment.userId?.photo ||
          comment.userId?.avatar ||
          comment.userId?.profilePhoto ||
          "",
      );
    }
    return "";
  };

  // Submit Comment
  const handleSubmitComment = async () => {
    const text = commentText.trim();

    if (!text) {
      return;
    }
    try {
      await onComment(post._id, text);
      setCommentText("");
    } catch (error) {
      console.error("Comment error: ", error);
    }
  };

  // Enter Key
  const handleCommentKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
    }
    handleSubmitComment();
  };

  return (
    <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
      {/* POST HEADER */}
      <div className="flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          {/* POST USER IMAGE */}
          {userImage ? (
            <img
              src={String(userImage)}
              alt={userName}
              className="w-11 h-11 rounded-full object-cover"
            />
          ) : (
            <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center font-semibold text-gray-600">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}

          {/* POST USER NAME */}
          <div>
            <h3 className="font-semibold text-gray-900">{userName}</h3>
            {formattedDate && (
              <p className="text-xs text-gray-500">{formattedDate}</p>
            )}
          </div>
        </div>

        {/* OWNER MENU */}
        {isOwner && (
          <div className="relative">
            {/* Three dot button */}
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="p-2 rounded-full hover:bg-gray-100 transition"
            >
              <EllipsisVertical size={21} className="text-gray-600" />
            </button>

            {/* MENU */}
            {showMenu && (
              <div className="absolute right-0 top-11 z-50 w-40 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                {/* EDIT POST */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    onEdit(post._id);
                  }}
                  className="w-full px-4 py-3 text-sm text-left flex items-center gap-2 hover:bg-gray-50 transition text-gray-700"
                >
                  <Pencil size={16} />
                  <span>{t("publicSpace.postCard.editPost")}</span>
                </button>

                {/* DELETE POST */}
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);

                    const confirmed = window.confirm(
                      t("publicSpace.postCard.deleteConfirm"),
                    );
                    if (confirmed) {
                      onDelete(post._id);
                    }
                  }}
                  className="w-full px-4 py-3 text-sm text-left flex items-center gap-2 text-red-600 hover:bg-red-50 transition"
                >
                  <Trash2 size={16} />
                  <span>{t("publicSpace.postCard.deletePost")}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Caption */}
      {post?.caption && (
        <div className="px-5 pb-4">
          <p className="text-gray-800 whitespace-pre-wrap break-words">
            {String(post.caption)}
          </p>
        </div>
      )}

      {/* MEDIA */}
      {mediaUrl && (
        <div className="w-full bg-black">
          {isVideo ? (
            <video
              src={mediaUrl}
              controls
              className="w-full max-h-[600px] object-contain"
            />
          ) : (
            <img
              src={mediaUrl}
              alt={t("publicSpace.postCard.mediaAlt")}
              className="w-full max-h-[600px] object-contain"
            />
          )}
        </div>
      )}

      {/* Action Bar */}
      <div className="px-5 py-3 border-t border-gray-200">
        <div className="flex items-center gap-6">
          {/* LIKE */}
          <button
            type="button"
            onClick={() => onLike(post._id)}
            className={`flex items-center gap-2 text-sm transition ${isLiked ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}
          >
            <Heart size={20} fill={isLiked ? "currentColor" : "none"} />
            <span>{likes.length}</span>
          </button>

          {/* COMMENT */}
          <button
            type="button"
            onClick={() => setShowComment((prev) => !prev)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 transition"
          >
            <MessageCircle size={20} />
            <span>{comments.length}</span>
          </button>

          {/* SHARE */}
          <button
            type="button"
            onClick={() => onShare(post._id)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-green-600 transition"
          >
            <Share2 size={20} />
            <span>{t("publicSpace.postCard.share")}</span>
          </button>
        </div>

        {/* COMMENT SECTION */}
        {showComment && (
          <div className="border-t border-gray-100 mt-3">
            {/* COMMENT LIST */}
            <div className="px-5 pt-4">
              <h4 className="font-semibold text-gray-500 mb-3">{t("publicSpace.postCard.comments")}</h4>
              {comments.length === 0 ? (
                <p className="text-sm text-gray-500 mb-4">
                  {t("publicSpace.postCard.noComments")}
                </p>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto">
                  {comments.map((Comment: any, index: number) => {
                    const commentUserName = getCommentUserName(Comment);
                    const commentUserImage = getCommentUserImage(Comment);
                    const commentText = String(
                      Comment?.text || Comment?.comment || "",
                    );

                    return (
                      <div key={Comment?._id || index} className="flex gap-3">
                        {/* Comment Avatar */}
                        {commentUserImage ? (
                          <img
                            src={commentUserImage}
                            alt={commentUserName}
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center text-xs font-semibold text-gray-600">
                            {commentUserName.charAt(0).toLocaleUpperCase()}
                          </div>
                        )}

                        {/* COMMENT */}
                        <div className="bg-gray-50 rounded-2xl px-4 py-2">
                          <p className="text-sm font-semibold text-gray-800 flex justify-center">
                            {commentUserName}
                          </p>
                          <p className="text-sm text-gray-700 break-words">
                            {commentText}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* COMMENT INPUT */}
            <div className="px-5 py-4 mt-3">
              <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 focus-within:border-blue-500 transition">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyDown={handleCommentKeyDown}
                  placeholder={t("publicSpace.postCard.commentPlaceholder")}
                  className="flex-1 outline-none text-sm bg-transparent placeholder:text-gray-400 text-gray-700"
                />
                <button
                  type="button"
                  onClick={handleSubmitComment}
                  disabled={!commentText.trim()}
                  className="text-sm font-semibold text-blue-600 disabled:text-gray-400 transition"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default PostCard;
