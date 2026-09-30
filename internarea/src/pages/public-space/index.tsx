"use client";

import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  useSelector,
} from "react-redux";

import {
  RefreshCw,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import Chat from "../../Components/PublicSpace/Chat/Chat";
import { useLanguage } from "@/context/LanguageContext";

import {
  selectuser,
} from "@/Feature/Userslice";

import CreatePost from "../../Components/PublicSpace/CreatePost";
import PostCard from "../../Components/PublicSpace/PostCard";
import ShareModal from "../../Components/PublicSpace/ShareModal";

const API_URL =
  "https://internshala-backend-5ycp.onrender.com/";

const PublicSpace = () => {
  const { t } = useLanguage();
  const user =
    useSelector(selectuser);

  const currentUserId =
    user?._id ||
    user?.id ||
    "";

  const [posts, setPosts] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  // ==========================================
  // SHARE MODAL
  // ==========================================

  const [
    showShareModal,
    setShowShareModal,
  ] = useState(false);

  const [
    selectedPostId,
    setSelectedPostId,
  ] = useState<
    string | null
  >(null);

  // ==========================================
  // OPENED SHARED POST
  // ==========================================

  const [
    selectedSharedPost,
    setSelectedSharedPost,
  ] = useState<any | null>(
    null,
  );

  // ==========================================
  // FETCH POSTS
  // ==========================================

  const fetchPosts =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            `${API_URL}/api/posts`,
            {
              cache: "no-store",
            },
          );

        const data =
          await response.json();

        console.log(
          "POST API RESPONSE:",
          data,
        );

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to fetch posts.",
          );
        }

        setPosts(
          Array.isArray(
            data.posts,
          )
            ? data.posts
            : [],
        );
      } catch (error) {
        console.error(
          "FETCH POSTS ERROR:",
          error,
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // ==========================================
  // LIKE
  // ==========================================

  const handleLike = async (
    postId: string,
  ) => {
    if (!currentUserId) {
      toast.error(
        t("publicSpace.loginFirst"),
      );

      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/api/posts/${postId}/like`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              userId:
                currentUserId,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to like post.",
        );
      }

      await fetchPosts();

      // Keep opened shared post updated
      setSelectedSharedPost(
        (previous: any) => {
          if (
            !previous ||
            String(
              previous._id,
            ) !== String(postId)
          ) {
            return previous;
          }

          const updated =
            posts.find(
              (post) =>
                String(
                  post._id,
                ) ===
                String(postId),
            );

          return updated ||
            previous;
        },
      );
    } catch (error) {
      console.error(
        "LIKE ERROR:",
        error,
      );

      toast.error(
        t("publicSpace.toasts.failedLike"),
      );
    }
  };

  // ==========================================
  // COMMENT
  // ==========================================

  const handleComment = async (
    postId: string,
    text: string,
  ) => {
    if (!currentUserId) {
      toast.error(
        t("publicSpace.loginFirst"),
      );

      return;
    }

    if (!text.trim()) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/api/posts/${postId}/comment`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              userId:
                currentUserId,

              text:
                text.trim(),
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to add comment.",
        );
      }

      await fetchPosts();

      // Update opened post
      const updated =
        posts.find(
          (post) =>
            String(
              post._id,
            ) ===
            String(postId),
        );

      if (updated) {
        setSelectedSharedPost(
          updated,
        );
      }
    } catch (error) {
      console.error(
        "COMMENT ERROR:",
        error,
      );

      toast.error(
        t("publicSpace.toasts.failedComment"),
      );
    }
  };

  // ==========================================
  // SHARE
  // ==========================================

  const handleShare = (
    postId: string,
  ) => {
    if (!currentUserId) {
      toast.error(
        t("publicSpace.loginFirst"),
      );

      return;
    }

    setSelectedPostId(
      postId,
    );

    setShowShareModal(
      true,
    );
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = async (
    postId: string,
  ) => {
    if (!currentUserId) {
      toast.error(
        t("publicSpace.loginFirst"),
      );

      return;
    }

    const post =
      posts.find(
        (item) =>
          String(
            item._id,
          ) ===
          String(postId),
      );

    if (!post) {
      return;
    }

    const newCaption =
      window.prompt(
        t("publicSpace.editPrompt"),
        post.caption || "",
      );

    if (
      newCaption ===
      null
    ) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/api/posts/${postId}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              userId:
                currentUserId,

              caption:
                newCaption.trim(),
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to edit post.",
        );
      }

      await fetchPosts();
    } catch (error) {
      console.error(
        "EDIT POST ERROR:",
        error,
      );

      toast.error(
        t("publicSpace.toasts.failedEdit"),
      );
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (
    postId: string,
  ) => {
    if (!currentUserId) {
      toast.error(
        t("publicSpace.loginFirst"),
      );

      return;
    }

    const confirmed =
      window.confirm(
        t("publicSpace.deleteConfirm"),
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `${API_URL}/api/posts/${postId}`,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              userId:
                currentUserId,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete post.",
        );
      }

      // If deleted post is currently open,
      // close it.
      setSelectedSharedPost(
        (previous: any) => {
          if (
            previous &&
            String(
              previous._id,
            ) === String(postId)
          ) {
            return null;
          }

          return previous;
        },
      );

      await fetchPosts();
    } catch (error) {
      console.error(
        "DELETE POST ERROR:",
        error,
      );

      toast.error(
        t("publicSpace.toasts.failedDelete"),
      );
    }
  };

  // ==========================================
  // OPEN SHARED POST FROM CHAT
  // ==========================================

  const handleOpenSharedPost = async (
    postReference: any,
  ) => {
    if (!postReference) {
      toast.error(
        t("publicSpace.toasts.postUnavailable"),
      );

      return;
    }

    // ========================================
    // CASE 1:
    // Backend populated sharedPost
    // ========================================

    if (
      typeof postReference ===
      "object" &&
      postReference._id
    ) {
      // First try to use the real post
      // from PublicSpace feed.
      const feedPost =
        posts.find(
          (post) =>
            String(
              post._id,
            ) ===
            String(
              postReference._id,
            ),
        );

      if (feedPost) {
        setSelectedSharedPost(
          feedPost,
        );

        return;
      }

      // Otherwise use populated object.
      setSelectedSharedPost(
        postReference,
      );

      return;
    }

    // ========================================
    // CASE 2:
    // sharedPost is only ObjectId string
    // ========================================

    const postId =
      typeof postReference ===
      "string"
        ? postReference
        : postReference?._id ||
          postReference?.id;

    if (!postId) {
      toast.error(
        t("publicSpace.toasts.postUnavailable"),
      );

      return;
    }

    // Search currently loaded feed
    const feedPost =
      posts.find(
        (post) =>
          String(
            post._id,
          ) ===
          String(postId),
      );

    if (feedPost) {
      setSelectedSharedPost(
        feedPost,
      );

      return;
    }

    // Refresh posts and try again
    try {
      const response =
        await fetch(
          `${API_URL}/api/posts`,
          {
            cache: "no-store",
          },
        );

      const data =
        await response.json();

      const refreshedPosts =
        Array.isArray(
          data.posts,
        )
          ? data.posts
          : [];

      const foundPost =
        refreshedPosts.find(
          (post: any) =>
            String(
              post._id,
            ) ===
            String(postId),
        );

      if (!foundPost) {
        toast.error(
          t("publicSpace.toasts.postNoLongerAvailable"),
        );

        return;
      }

      setPosts(
        refreshedPosts,
      );

      setSelectedSharedPost(
        foundPost,
      );
    } catch (error) {
      console.error(
        "OPEN SHARED POST ERROR:",
        error,
      );

      toast.error(
        t("publicSpace.toasts.couldNotOpenPost"),
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ======================================
          PUBLIC SPACE
      ====================================== */}

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* HEADER */}

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("publicSpace.title")}
          </h1>

          <p className="mt-2 text-gray-500">
            {t("publicSpace.description")}
          </p>
        </div>

        {/* CONTENT */}

        <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-8">
          {/* CREATE POST */}

          <div>
            <CreatePost
              onPostCreated={
                fetchPosts
              }
            />
          </div>

          {/* FEED */}

          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {t("publicSpace.communityFeed")}
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  {t("publicSpace.latestPosts")}
                </p>
              </div>

              <button
                type="button"
                onClick={
                  fetchPosts
                }
                disabled={
                  loading
                }
                className="
                  flex
                  items-center
                  gap-2
                  px-3
                  py-2
                  rounded-lg
                  text-sm
                  text-gray-600
                  hover:bg-white
                  hover:text-blue-600
                  transition
                  disabled:opacity-50
                "
              >
                <RefreshCw
                  size={16}
                  className={
                    loading
                      ? "animate-spin"
                      : ""
                  }
                />

                {t("publicSpace.refresh")}
              </button>
            </div>

            {loading ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                <RefreshCw
                  size={26}
                  className="mx-auto animate-spin text-gray-400"
                />

                <p className="mt-3 text-sm text-gray-500">
                  {t("publicSpace.loadingPosts")}
                </p>
              </div>
            ) : posts.length ===
              0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  {t("publicSpace.noPostsTitle")}
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  {t("publicSpace.noPostsDesc")}
                </p>
              </div>
            ) : (
              posts.map(
                (post) => (
                  <PostCard
                    key={
                      post._id
                    }
                    post={
                      post
                    }
                    currentUserId={
                      currentUserId
                    }
                    onLike={
                      handleLike
                    }
                    onComment={
                      handleComment
                    }
                    onShare={
                      handleShare
                    }
                    onEdit={
                      handleEdit
                    }
                    onDelete={
                      handleDelete
                    }
                  />
                ),
              )
            )}
          </div>
        </div>
      </div>

      {/* ======================================
          SHARE MODAL
      ====================================== */}

      {showShareModal &&
        selectedPostId && (
          <ShareModal
            postId={
              selectedPostId
            }
            currentUserId={
              currentUserId
            }
            onClose={() => {
              setShowShareModal(
                false,
              );

              setSelectedPostId(
                null,
              );
            }}
            onShared={
              fetchPosts
            }
          />
        )}

      {/* ======================================
          ORIGINAL POST VIEWER
          ONLY OPENS AFTER CLICKING
          SHARED POST IN CHAT
      ====================================== */}

      {selectedSharedPost && (
        <div
          className="
            fixed
            inset-0
            z-[250]
            bg-black/60
            flex
            items-center
            justify-center
            p-4
          "
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              setSelectedSharedPost(
                null,
              );
            }
          }}
        >
          <div
            className="
              relative
              w-full
              max-w-[840px]
              max-h-[92vh]
              overflow-y-auto
              rounded-2xl
            "
          >
            {/* CLOSE */}

            <button
              type="button"
              onClick={() =>
                setSelectedSharedPost(
                  null,
                )
              }
              className="
                absolute
                right-3
                top-3
                z-20
                w-10
                h-10
                rounded-full
                bg-white
                shadow-lg
                flex
                items-center
                justify-center
                text-gray-600
                hover:bg-gray-100
              "
            >
              <X size={20} />
            </button>

            {/* ORIGINAL POST */}

            <PostCard
              post={
                selectedSharedPost
              }
              currentUserId={
                currentUserId
              }
              onLike={
                handleLike
              }
              onComment={
                handleComment
              }
              onShare={
                handleShare
              }
              onEdit={
                handleEdit
              }
              onDelete={
                handleDelete
              }
            />
          </div>
        </div>
      )}

      {/* ======================================
          CHAT
      ====================================== */}

      <Chat
        currentUserId={
          currentUserId
        }
        onOpenPost={
          handleOpenSharedPost
        }
      />
    </div>
  );
};

export default PublicSpace;