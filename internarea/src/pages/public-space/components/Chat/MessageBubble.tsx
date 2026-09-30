"use client";

import React from "react";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = "http://internshala-backend-5ycp.onrender.com/";

interface SharedPost {
  _id?: string;
  id?: string;

  caption?: string;

  media?: any;

  createdAt?: string;

  user?: any;
  author?: any;
  createdBy?: any;

  userId?: any;

  likes?: any[];
  comments?: any[];
}

interface MessageBubbleProps {
  message: {
    _id?: string;
    id?: string;

    sender?:
      | string
      | {
          _id?: string;
          id?: string;
          name?: string;
        };

    receiver?:
      | string
      | {
          _id?: string;
          id?: string;
        };

    text?: string;
    message?: string;
    content?: string;

    messageType?: string;

    sharedPost?:
      | string
      | SharedPost;

    createdAt?: string;
  };

  currentUserId: string;

  // IMPORTANT
  onOpenPost?: (post: any) => void;
}

const MessageBubble = ({
  message,
  currentUserId,
  onOpenPost,
}: MessageBubbleProps) => {
  const { t } = useLanguage();
  // ==========================================
  // SENDER
  // ==========================================

  const senderId =
    typeof message.sender ===
    "string"
      ? message.sender
      : message.sender?._id ||
        message.sender?.id;

  const isMine =
    String(senderId) ===
    String(currentUserId);

  // ==========================================
  // TIME
  // ==========================================

  let time = "";

  if (message.createdAt) {
    const date =
      new Date(
        message.createdAt,
      );

    if (
      !Number.isNaN(
        date.getTime(),
      )
    ) {
      time =
        date.toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        );
    }
  }

  // ==========================================
  // IS POST MESSAGE?
  // ==========================================

  const isPost =
    message.messageType ===
    "post";

  // ==========================================
  // SHARED POST
  // ==========================================

  const sharedPost =
    message.sharedPost;

  // ==========================================
  // GET POST ID
  // ==========================================

  const getPostId = (
    post: any,
  ): string | null => {
    if (!post) {
      return null;
    }

    if (
      typeof post === "string"
    ) {
      return post;
    }

    return (
      post._id ||
      post.id ||
      null
    );
  };

  // ==========================================
  // POST OWNER
  // ==========================================

  const getPostOwner =
    (post: any) => {
      if (!post) {
        return null;
      }

      return (
        post.user ||
        post.author ||
        post.createdBy ||
        post.userId ||
        null
      );
    };

  const postOwner =
    typeof sharedPost ===
    "object"
      ? getPostOwner(
          sharedPost,
        )
      : null;

  const ownerName =
    typeof postOwner ===
      "object"
      ? postOwner?.name ||
        postOwner?.fullname ||
        postOwner?.fullName ||
        postOwner?.username ||
        "User"
      : t("publicSpace.chat.sharedPost");

  // ==========================================
  // OWNER PHOTO
  // ==========================================

  const ownerPhoto =
    typeof postOwner ===
      "object"
      ? postOwner?.photo ||
        postOwner?.profileImage ||
        postOwner?.avatar ||
        ""
      : "";

  // ==========================================
  // MEDIA
  // ==========================================

  const media =
    typeof sharedPost ===
      "object"
      ? Array.isArray(
          sharedPost?.media,
        )
        ? sharedPost.media[0]
        : sharedPost?.media
      : null;

  const rawMediaUrl =
    typeof media === "string"
      ? media
      : media?.url ||
        media?.path ||
        "";

  const mediaUrl = rawMediaUrl
    ? String(
        rawMediaUrl,
      ).startsWith("http")
      ? String(rawMediaUrl)
      : `${API_URL}/uploads/public/${String(
          rawMediaUrl,
        ).replace(
          /^\/+/,
          "",
        )}`
    : "";

  // ==========================================
  // MEDIA TYPE
  // ==========================================

  const mediaType =
    typeof media === "object"
      ? media?.type
      : "";

  const isVideo =
    mediaType ===
      "video" ||
    /\.(mp4|mov|avi|mkv|webm)$/i.test(
      mediaUrl,
    );

  // ==========================================
  // OPEN POST
  // ==========================================

  const handleOpenPost = () => {
    if (!sharedPost) {
      return;
    }

    const postId =
      getPostId(
        sharedPost,
      );

    if (!postId) {
      return;
    }

    if (onOpenPost) {
      onOpenPost(
        sharedPost,
      );
    }
  };

  // ==========================================
  // NORMAL TEXT MESSAGE
  // ==========================================

  if (!isPost) {
    const messageText =
      message.text ??
      message.message ??
      message.content ??
      "";

    return (
      <div
        className={`flex w-full ${
          isMine
            ? "justify-end"
            : "justify-start"
        }`}
      >
        <div
          className={`
            max-w-[75%]
            min-w-[40px]
            px-4
            py-2.5
            rounded-2xl
            text-sm
            shadow-sm
            break-words
            ${
              isMine
                ? "bg-green-500 text-white rounded-br-md"
                : "bg-white text-gray-800 border border-gray-200 rounded-bl-md"
            }
          `}
        >
          {messageText ? (
            <p className="whitespace-pre-wrap break-words leading-relaxed">
              {messageText}
            </p>
          ) : (
            <p className="text-xs opacity-60">
              {t("publicSpace.chat.message")}
            </p>
          )}

          {time && (
            <p
              className={`
                text-[10px]
                mt-1
                text-right
                ${
                  isMine
                    ? "text-green-100"
                    : "text-gray-400"
                }
              `}
            >
              {time}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ==========================================
  // SHARED POST MESSAGE
  // ==========================================

  return (
    <div
      className={`flex w-full ${
        isMine
          ? "justify-end"
          : "justify-start"
      }`}
    >
      <div className="max-w-[78%]">
        <button
          type="button"
          onClick={
            handleOpenPost
          }
          className={`
            block
            w-full
            overflow-hidden
            rounded-2xl
            border
            text-left
            shadow-sm
            transition
            hover:shadow-md
            ${
              isMine
                ? "border-green-400 bg-green-500"
                : "border-gray-200 bg-white"
            }
          `}
        >
          {/* ==================================
              POST HEADER
          ================================== */}

          <div
            className={`
              flex
              items-center
              gap-2.5
              px-3.5
              py-3
              ${
                isMine
                  ? "text-white"
                  : "text-gray-800"
              }
            `}
          >
            {ownerPhoto ? (
              <img
                src={ownerPhoto}
                alt={ownerName}
                className="
                  w-8
                  h-8
                  rounded-full
                  object-cover
                  shrink-0
                "
              />
            ) : (
              <div
                className={`
                  w-8
                  h-8
                  rounded-full
                  flex
                  items-center
                  justify-center
                  font-semibold
                  text-xs
                  shrink-0
                  ${
                    isMine
                      ? "bg-white/20 text-white"
                      : "bg-gray-200 text-gray-600"
                  }
                `}
              >
                {String(
                  ownerName,
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}

            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">
                {ownerName}
              </p>

              <p
                className={`
                  text-[11px]
                  ${
                    isMine
                      ? "text-green-100"
                      : "text-gray-500"
                  }
                `}
              >
                {t("publicSpace.chat.sharedPostPreview")}
              </p>
            </div>
          </div>

          {/* ==================================
              MEDIA
          ================================== */}

          {mediaUrl && (
            <div className="w-full bg-black">
              {isVideo ? (
                <video
                  src={mediaUrl}
                  className="
                    w-full
                    h-[180px]
                    object-cover
                  "
                  muted
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={mediaUrl}
                  alt={t("publicSpace.chat.sharedPost")}
                  className="
                    w-full
                    h-[180px]
                    object-cover
                  "
                />
              )}
            </div>
          )}

          {/* ==================================
              CAPTION
          ================================== */}

          {typeof sharedPost ===
            "object" &&
            sharedPost?.caption && (
              <div
                className={`
                  px-3.5
                  py-3
                  ${
                    isMine
                      ? "text-white"
                      : "text-gray-800"
                  }
                `}
              >
                <p className="text-sm line-clamp-3 whitespace-pre-wrap break-words">
                  {String(
                    sharedPost.caption,
                  )}
                </p>
              </div>
            )}

          {/* ==================================
              OPEN POST FOOTER
          ================================== */}

          <div
            className={`
              px-3.5
              py-2.5
              border-t
              ${
                isMine
                  ? "border-green-400 text-green-50"
                  : "border-gray-100 text-green-600"
              }
            `}
          >
            <p className="text-xs font-semibold">
              {t("publicSpace.chat.tapToOpenPost")}
            </p>
          </div>
        </button>

        {/* TIME */}

        {time && (
          <p
            className={`
              text-[10px]
              mt-1
              ${
                isMine
                  ? "text-right text-gray-400"
                  : "text-left text-gray-400"
              }
            `}
          >
            {time}
          </p>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;