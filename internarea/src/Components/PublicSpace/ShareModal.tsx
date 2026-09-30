"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  Search,
  Send,
  X,
} from "lucide-react";

import toast from "react-hot-toast";
import { useLanguage } from "@/context/LanguageContext";

const API_URL =
  "https://internshala-backend-5ycp.onrender.com/";

interface User {
  _id: string;
  id?: string;
  name: string;
  email?: string;
  photo?: string;
}

interface ShareModalProps {
  postId: string;
  currentUserId: string;

  onClose: () => void;

  onShared?: () => void;
}

const ShareModal = ({
  postId,
  currentUserId,
  onClose,
  onShared,
}: ShareModalProps) => {
  const { t } = useLanguage();
  const [search, setSearch] =
    useState("");

  const [users, setUsers] =
    useState<User[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [sendingUserId, setSendingUserId] =
    useState<string | null>(null);

  // ==========================================
  // SEARCH USERS
  // ==========================================

  useEffect(() => {
    const query =
      search.trim();

    if (!query) {
      setUsers([]);
      return;
    }

    const timer =
      setTimeout(async () => {
        try {
          setLoading(true);

          const response =
            await fetch(
              `${API_URL}/api/messages/search-users?query=${encodeURIComponent(
                query,
              )}&userId=${encodeURIComponent(
                currentUserId,
              )}`,
              {
                cache: "no-store",
              },
            );

          const data =
            await response.json();

          console.log(
            "SHARE USER SEARCH:",
            data,
          );

          if (
            !response.ok ||
            !data.success
          ) {
            setUsers([]);
            return;
          }

          setUsers(
            Array.isArray(
              data.users,
            )
              ? data.users
              : [],
          );
        } catch (error) {
          console.error(
            "SHARE SEARCH ERROR:",
            error,
          );

          setUsers([]);
        } finally {
          setLoading(false);
        }
      }, 300);

    return () =>
      clearTimeout(timer);
  }, [
    search,
    currentUserId,
  ]);

  // ==========================================
  // SEND POST
  // ==========================================

  const sharePost = async (
    receiverId: string,
  ) => {
    if (!postId) {
      toast.error(
        t("publicSpace.shareModal.postIdMissing"),
      );

      return;
    }

    if (!currentUserId) {
      toast.error(
        t("publicSpace.loginFirst"),
      );

      return;
    }

    try {
      setSendingUserId(
        receiverId,
      );

      const response =
        await fetch(
          `${API_URL}/api/messages/send`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              sender:
                currentUserId,

              receiver:
                receiverId,

              // Post messages don't need normal text
              text: "",

              // THIS IS THE IMPORTANT PART
              messageType:
                "post",

              // Original Post ID
              sharedPost:
                postId,
            }),
          },
        );

      const data =
        await response.json();

      console.log(
        "SHARE POST RESPONSE:",
        data,
      );

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            t("publicSpace.shareModal.failedShare"),
        );
      }

      toast.success(
        t("publicSpace.shareModal.postShared"),
      );

      onShared?.();

      onClose();
    } catch (error: any) {
      console.error(
        "SHARE POST ERROR:",
        error,
      );

      toast.error(
        error?.message ||
          t("publicSpace.shareModal.failedShare"),
      );
    } finally {
      setSendingUserId(null);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[300]
        bg-black/50
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
          onClose();
        }
      }}
    >
      <div
        className="
          w-full
          max-w-md
          bg-white
          rounded-2xl
          shadow-2xl
          overflow-hidden
        "
      >
        {/* ==================================
            HEADER
        ================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            px-5
            py-4
            border-b
            border-gray-200
          "
        >
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {t("publicSpace.shareModal.title")}
            </h2>

            <p className="text-xs text-gray-500 mt-1">
              {t("publicSpace.shareModal.subtitle")}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="
              p-2
              rounded-full
              hover:bg-gray-100
              text-gray-500
            "
          >
            <X size={19} />
          </button>
        </div>

        {/* ==================================
            SEARCH
        ================================== */}

        <div className="p-4 border-b border-gray-100">
          <div className="relative">
            <Search
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
              "
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value,
                )
              }
              placeholder={t("publicSpace.shareModal.searchPlaceholder")}
              autoFocus
              className="
                w-full
                h-11
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                pl-10
                pr-3
                text-sm
                text-gray-800
                outline-none
                focus:ring-2
                focus:ring-green-400
                focus:bg-white
              "
            />
          </div>
        </div>

        {/* ==================================
            USERS
        ================================== */}

        <div className="max-h-[380px] overflow-y-auto">
          {!search.trim() ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-gray-500">
                {t("publicSpace.shareModal.searchPrompt")}
              </p>
            </div>
          ) : loading ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm text-gray-500">
                {t("publicSpace.shareModal.searching")}
              </p>
            </div>
          ) : users.length ===
            0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm font-medium text-gray-700">
                {t("publicSpace.shareModal.noUsers")}
              </p>

              <p className="text-xs text-gray-400 mt-1">
                {t("publicSpace.shareModal.tryAnother")}
              </p>
            </div>
          ) : (
            <div className="py-2">
              {users.map(
                (user) => {
                  const userId =
                    user._id ||
                    user.id ||
                    "";

                  const isSending =
                    sendingUserId ===
                    userId;

                  return (
                    <button
                      key={String(
                        userId,
                      )}
                      type="button"
                      disabled={
                        !!sendingUserId
                      }
                      onClick={() =>
                        sharePost(
                          String(
                            userId,
                          ),
                        )
                      }
                      className="
                        w-full
                        flex
                        items-center
                        gap-3
                        px-5
                        py-3
                        text-left
                        hover:bg-gray-50
                        transition
                        disabled:opacity-50
                      "
                    >
                      {user.photo ? (
                        <img
                          src={
                            user.photo.startsWith(
                              "http",
                            )
                              ? user.photo
                              : `${API_URL}${user.photo}`
                          }
                          alt={
                            user.name
                          }
                          className="
                            w-11
                            h-11
                            rounded-full
                            object-cover
                            shrink-0
                          "
                        />
                      ) : (
                        <div
                          className="
                            w-11
                            h-11
                            rounded-full
                            bg-green-500
                            text-white
                            flex
                            items-center
                            justify-center
                            font-semibold
                            shrink-0
                          "
                        >
                          {user.name
                            ?.charAt(
                              0,
                            )
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {user.name}
                        </p>

                        {user.email && (
                          <p className="text-xs text-gray-500 truncate">
                            {user.email}
                          </p>
                        )}
                      </div>

                      <div
                        className="
                          w-9
                          h-9
                          rounded-full
                          bg-green-50
                          text-green-600
                          flex
                          items-center
                          justify-center
                        "
                      >
                        {isSending ? (
                          <span className="text-xs">
                            ...
                          </span>
                        ) : (
                          <Send
                            size={16}
                          />
                        )}
                      </div>
                    </button>
                  );
                },
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;