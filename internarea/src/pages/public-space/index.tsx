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

import Chat from "./components/Chat/Chat";

import {
  selectuser,
} from "@/Feature/Userslice";

import CreatePost from "./components/CreatePost";
import PostCard from "./components/PostCard";
import ShareModal from "./components/ShareModal";

const API_URL =
  "http://localhost:5000";

const PublicSpace = () => {
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
        "Please login first.",
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
        "Failed to like post.",
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
        "Please login first.",
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
        "Failed to add comment.",
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
        "Please login first.",
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
        "Please login first.",
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
        "Edit your caption:",
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
        "Failed to edit post.",
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
        "Please login first.",
      );

      return;
    }

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this post?",
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
        "Failed to delete post.",
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
        "Post is unavailable.",
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
        "Post is unavailable.",
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
          "This post is no longer available.",
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
        "Could not open post.",
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
            Public Space
          </h1>

          <p className="mt-2 text-gray-500">
            Share your thoughts, photos and videos with the community.
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
                  Community Feed
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Latest posts from the community
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

                Refresh
              </button>
            </div>

            {loading ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                <RefreshCw
                  size={26}
                  className="mx-auto animate-spin text-gray-400"
                />

                <p className="mt-3 text-sm text-gray-500">
                  Loading posts...
                </p>
              </div>
            ) : posts.length ===
              0 ? (
              <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  No posts yet
                </h3>

                <p className="mt-2 text-sm text-gray-500">
                  Be the first person to share something with the community!
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