"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

import MessageNotification from "./MessageNotification";

import {
  ArrowLeft,
  MessageCircle,
  MoveVertical,
  Search,
  Send,
  X,
} from "lucide-react";

import MessageBubble from "./MessageBubble";
import { useLanguage } from "@/context/LanguageContext";

const API_URL = "http://internshala-backend-5ycp.onrender.com/";

interface ChatProps {
  currentUserId: string;

  // When a shared post is clicked inside Chat
  onOpenPost?: (post: any) => void;
}

interface User {
  _id: string;
  id?: string;
  name: string;
  email?: string;
  photo?: string;
  profilePicture?: string;
  avatar?: string;
}

interface Message {
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

  // IMPORTANT
  sharedPost?: any;

  isRead?: boolean;

  createdAt?: string;
}

interface Conversation {
  user?: User;

  lastMessage?: Message;
  LastMessage?: Message;

  unreadCount?: number;

  _id?: string;
  id?: string;

  sender?: any;
  receiver?: any;

  text?: string;
  message?: string;
  content?: string;

  createdAt?: string;
}

interface NotificationData {
  messageId: string;
  senderId: string;
  senderName: string;
  message: string;
}

const Chat = ({ currentUserId, onOpenPost }: ChatProps) => {
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const previousMessages = useRef<Map<string, string>>(new Map());

  const firstConversationLoad = useRef(true);

  const notifiedMessages = useRef<Set<string>>(new Set());

  const [isOpen, setIsOpen] = useState(false);

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [conversations, setConversations] = useState<Conversation[]>([]);

  const [searchResults, setSearchResults] = useState<User[]>([]);

  const [messages, setMessages] = useState<Message[]>([]);

  const [text, setText] = useState("");

  const [search, setSearch] = useState("");

  const [searchLoading, setSearchLoading] = useState(false);

  const [loading, setLoading] = useState(false);

  const [notification, setNotification] = useState<NotificationData | null>(
    null,
  );

  // ==========================================
  // GET ID
  // ==========================================

  const getId = (value: any): string | null => {
    if (!value) {
      return null;
    }

    if (typeof value === "string") {
      return value;
    }

    return value._id || value.id || null;
  };

  // ==========================================
  // GET MESSAGE TEXT
  // ==========================================

  const getMessageText = (message: any): string => {
    if (!message) {
      return "";
    }

    // IMPORTANT:
    // Post messages don't have normal text.
    if (message.messageType === "post" || message.type === "post") {
      return "Shared a post.";
    }

    return message.text ?? message.message ?? message.content ?? "";
  };

  // ==========================================
  // GET MESSAGE ID
  // ==========================================

  const getMessageId = (message: any): string | null => {
    if (!message) {
      return null;
    }

    const id = message._id ?? message.id;

    return id ? String(id) : null;
  };

  // ==========================================
  // GET SENDER ID
  // ==========================================

  const getSenderId = (message: any): string | null => {
    if (!message) {
      return null;
    }

    return getId(message.sender);
  };

  // ==========================================
  // NORMALIZE MESSAGE
  // ==========================================

  const normalizeMessage = (raw: any): Message | null => {
    if (!raw) {
      return null;
    }

    return {
      ...raw,

      _id: raw._id ?? raw.id,

      id: raw.id ?? raw._id,

      sender: raw.sender ?? raw.senderId ?? raw.from,

      receiver: raw.receiver ?? raw.receiverId ?? raw.to,

      text: raw.text ?? raw.message ?? raw.content ?? "",

      message: raw.message,

      content: raw.content,

      messageType: raw.messageType ?? raw.type ?? "text",

      // ======================================
      // THIS IS CRITICAL
      // ======================================

      sharedPost: raw.sharedPost ?? raw.post ?? raw.shared_post ?? null,

      isRead: raw.isRead,

      createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
    };
  };

  // ==========================================
  // EXTRACT MESSAGE ARRAY
  // ==========================================

  const extractMessages = (data: any): Message[] => {
    let list: any[] = [];

    if (Array.isArray(data)) {
      list = data;
    } else if (Array.isArray(data?.messages)) {
      list = data.messages;
    } else if (Array.isArray(data?.message)) {
      list = data.message;
    } else if (Array.isArray(data?.data)) {
      list = data.data;
    } else if (Array.isArray(data?.data?.messages)) {
      list = data.data.messages;
    } else if (Array.isArray(data?.data?.message)) {
      list = data.data.message;
    } else if (data?.data && typeof data.data === "object") {
      list = [data.data];
    } else if (data?.message && typeof data.message === "object") {
      list = [data.message];
    }

    return list
      .map(normalizeMessage)
      .filter((item): item is Message => item !== null);
  };

  // ==========================================
  // GET USER FROM CONVERSATION
  // ==========================================

  const getUserFromConversation = (conversation: Conversation): User | null => {
    if (conversation.user) {
      return conversation.user;
    }

    const senderId = getId(conversation.sender);

    const receiverId = getId(conversation.receiver);

    if (senderId && String(senderId) !== String(currentUserId)) {
      if (typeof conversation.sender === "object") {
        return {
          _id: senderId,
          name: conversation.sender?.name || "User",
          email: conversation.sender?.email,
          photo: conversation.sender?.photo,
        };
      }
    }

    if (receiverId && String(receiverId) !== String(currentUserId)) {
      if (typeof conversation.receiver === "object") {
        return {
          _id: receiverId,
          name: conversation.receiver?.name || "User",
          email: conversation.receiver?.email,
          photo: conversation.receiver?.photo,
        };
      }
    }

    return null;
  };

  // ==========================================
  // GET LAST MESSAGE
  // ==========================================

  const getLastMessage = (conversation: Conversation): Message | null => {
    if (conversation.lastMessage) {
      return conversation.lastMessage;
    }

    if (conversation.LastMessage) {
      return conversation.LastMessage;
    }

    if (conversation.text || conversation.message || conversation.content) {
      return {
        _id: conversation._id,
        id: conversation.id,

        sender: conversation.sender,

        receiver: conversation.receiver,

        text:
          conversation.text ??
          conversation.message ??
          conversation.content ??
          "",

        message: conversation.message,

        content: conversation.content,

        createdAt: conversation.createdAt,
      };
    }

    return null;
  };

  // ==========================================
  // SEARCH USERS
  // ==========================================

  useEffect(() => {
    const searchUsers = async () => {
      const query = search.trim();

      if (!query) {
        setSearchResults([]);
        return;
      }

      if (!currentUserId) {
        return;
      }

      try {
        setSearchLoading(true);

        const response = await fetch(
          `${API_URL}/api/messages/search-users?query=${encodeURIComponent(
            query,
          )}&userId=${encodeURIComponent(currentUserId)}`,
          {
            cache: "no-store",
          },
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          setSearchResults([]);
          return;
        }

        setSearchResults(Array.isArray(data.users) ? data.users : []);
      } catch (error) {
        console.error("SEARCH USERS ERROR:", error);

        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    };

    const timer = setTimeout(searchUsers, 300);

    return () => clearTimeout(timer);
  }, [search, currentUserId]);

  // ==========================================
  // FETCH CONVERSATIONS
  // ==========================================

  const fetchConversations = useCallback(async () => {
    if (!currentUserId) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/messages/conversations/${currentUserId}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Conversation API error:", data);

        return;
      }

      let list = data.conversation ?? data.conversations ?? data.data ?? [];

      if (!Array.isArray(list) && Array.isArray(list?.conversations)) {
        list = list.conversations;
      }

      if (!Array.isArray(list)) {
        list = [];
      }

      setConversations(list);

      // ======================================
      // FIRST LOAD
      // ======================================

      if (firstConversationLoad.current) {
        list.forEach((conversation: Conversation) => {
          const user = getUserFromConversation(conversation);

          const lastMessage = getLastMessage(conversation);

          if (!user || !lastMessage) {
            return;
          }

          const userId = getId(user);

          const messageId = getMessageId(lastMessage);

          if (userId && messageId) {
            previousMessages.current.set(String(userId), messageId);
          }
        });

        firstConversationLoad.current = false;

        return;
      }

      // ======================================
      // NEW MESSAGE NOTIFICATION
      // ======================================

      list.forEach((conversation: Conversation) => {
        const user = getUserFromConversation(conversation);

        const lastMessage = getLastMessage(conversation);

        if (!user || !lastMessage) {
          return;
        }

        const userId = getId(user);

        const messageId = getMessageId(lastMessage);

        const senderId = getSenderId(lastMessage);

        const messageText = getMessageText(lastMessage);

        if (!userId || !messageId || !senderId) {
          return;
        }

        if (String(senderId) === String(currentUserId)) {
          previousMessages.current.set(String(userId), messageId);

          return;
        }

        const previousId = previousMessages.current.get(String(userId));

        if (
          previousId !== messageId &&
          !notifiedMessages.current.has(messageId)
        ) {
          notifiedMessages.current.add(messageId);

          setNotification({
            messageId,
            senderId,
            senderName: user.name || "New message",
            message: messageText,
          });
        }

        previousMessages.current.set(String(userId), messageId);
      });
    } catch (error) {
      console.error("FETCH CONVERSATIONS ERROR:", error);
    }
  }, [currentUserId]);

  // ==========================================
  // FETCH MESSAGES
  // ==========================================

  const fetchMessages = useCallback(async () => {
    if (!selectedUserId) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/messages/${currentUserId}/${selectedUserId}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("Message API error:", data);

        return;
      }

      const serverMessages = extractMessages(data);

      setMessages(serverMessages);
    } catch (error) {
      console.error("FETCH MESSAGES ERROR:", error);
    }
  }, [currentUserId, selectedUserId]);

  // ==========================================
  // OPEN CONVERSATION
  // ==========================================

  const openConversation = async (user: User) => {
    const userId = user._id || user.id;

    if (!userId) {
      return;
    }

    const otherUserId = String(userId);

    // ==========================================
    // OPEN UI
    // ==========================================

    setNotification(null);
    setIsOpen(true);
    setSelectedUserId(otherUserId);
    setSelectedUser(user);
    setMessages([]);

    try {
      // ==========================================
      // 1. FETCH CONVERSATION
      // ==========================================

      const response = await fetch(
        `${API_URL}/api/messages/${currentUserId}/${otherUserId}`,
        {
          cache: "no-store",
        },
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        console.error("OPEN CONVERSATION API ERROR:", data);

        return;
      }

      const serverMessages = extractMessages(data);

      setMessages(serverMessages);

      // ==========================================
      // 2. MARK THEIR MESSAGES AS READ
      // ==========================================

      const readResponse = await fetch(
        `${API_URL}/api/messages/read/${currentUserId}/${otherUserId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const readData = await readResponse.json();

      if (!readResponse.ok || !readData.success) {
        console.error("MARK READ API ERROR:", readData);

        return;
      }

      console.log("MESSAGES MARKED AS READ:", readData);

      // ==========================================
      // 3. REFRESH CONVERSATION LIST
      // ==========================================

      await fetchConversations();
    } catch (error) {
      console.error("OPEN CONVERSATION ERROR:", error);
    }
  };

  // ==========================================
  // POLL CONVERSATIONS
  // ==========================================

  useEffect(() => {
    if (!currentUserId) {
      return;
    }

    fetchConversations();

    const interval = setInterval(() => {
      fetchConversations();
    }, 1500);

    return () => clearInterval(interval);
  }, [currentUserId, fetchConversations]);

  // ==========================================
  // POLL CURRENT CHAT
  // ==========================================

  useEffect(() => {
    if (!isOpen || !selectedUserId) {
      return;
    }

    fetchMessages();

    const interval = setInterval(() => {
      fetchMessages();
    }, 1500);

    return () => clearInterval(interval);
  }, [isOpen, selectedUserId, fetchMessages]);

  // ==========================================
  // AUTO SCROLL
  // ==========================================

  useEffect(() => {
    if (!selectedUserId) {
      return;
    }

    requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
      });
    });
  }, [messages, selectedUserId]);

  // ==========================================
  // SEND NORMAL TEXT MESSAGE
  // ==========================================

  const sendMessage = async () => {
    if (!text.trim() || !selectedUserId || loading) {
      return;
    }

    const messageText = text.trim();

    setText("");

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/messages/send`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          sender: currentUserId,

          receiver: selectedUserId,

          text: messageText,

          messageType: "text",
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setText(messageText);
        return;
      }

      const returnedMessages = extractMessages(data);

      if (returnedMessages.length > 0) {
        setMessages((previous) => {
          const existingIds = new Set(
            previous.map(getMessageId).filter(Boolean),
          );

          const newMessages = returnedMessages.filter((message) => {
            const id = getMessageId(message);

            if (!id) {
              return true;
            }

            return !existingIds.has(id);
          });

          return [...previous, ...newMessages];
        });
      } else {
        const temporaryMessage: Message = {
          id: `temporary-${Date.now()}`,

          sender: currentUserId,

          receiver: selectedUserId,

          text: messageText,

          messageType: "text",

          createdAt: new Date().toISOString(),
        };

        setMessages((previous) => [...previous, temporaryMessage]);
      }

      await fetchConversations();

      setTimeout(() => {
        fetchMessages();
      }, 300);
    } catch (error) {
      console.error("SEND MESSAGE ERROR:", error);

      setText(messageText);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // CLOSE CHAT
  // ==========================================

  const closeChat = () => {
    setIsOpen(false);

    setSelectedUserId(null);

    setSelectedUser(null);

    setMessages([]);

    setText("");

    setSearch("");

    setSearchResults([]);
  };

  // ==========================================
  // NOTIFICATION CLICK
  // ==========================================

  const handleNotificationClick = async () => {
    if (!notification) {
      return;
    }

    const senderId = notification.senderId;

    setNotification(null);

    const conversation = conversations.find((item) => {
      const user = getUserFromConversation(item);

      if (!user) {
        return false;
      }

      const userId = getId(user);

      return String(userId) === String(senderId);
    });

    if (conversation) {
      const user = getUserFromConversation(conversation);

      if (user) {
        await openConversation(user);

        return;
      }
    }

    await fetchConversations();
  };

  // ==========================================
  // TOTAL UNREAD COUNT
  // ==========================================

  const totalUnreadCount = conversations.reduce((total, conversation) => {
    return total + (Number(conversation.unreadCount) || 0);
  }, 0);

  // ==========================================
  // FILTER CONVERSATIONS
  // ==========================================

  const filteredConversations = conversations.filter((conversation) => {
    const user = getUserFromConversation(conversation);

    return user?.name?.toLowerCase().includes(search.toLowerCase()) ?? false;
  });

  const isSearching = search.trim().length > 0;

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <>
      {/* ======================================
          NOTIFICATION
      ====================================== */}

      {notification && (
        <MessageNotification
          senderName={notification.senderName}
          message={notification.message}
          onClick={handleNotificationClick}
          onClose={() => setNotification(null)}
        />
      )}

      {/* ======================================
          FLOATING CHAT BUTTON
      ====================================== */}

      {!isOpen && (
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            fetchConversations();
          }}
          className="
    fixed
    bottom-4
    right-4
    sm:bottom-6
    sm:right-6
    z-[100]
    flex
    items-center
    justify-center
    gap-2
    rounded-full
    sm:rounded-lg
    bg-green-500
    p-3.5
    sm:px-4
    sm:py-3
    text-white
    shadow-xl
    hover:bg-green-600
    active:scale-95
    transition
  "
        >
          <div className="relative">
            <MessageCircle size={24} className="sm:w-[26px] sm:h-[26px]" />

            {/* ==================================
        TOTAL UNREAD BADGE
    ================================== */}

            {totalUnreadCount > 0 && (
              <span
                className="
          absolute
          -right-2.5
          -top-2.5
          min-w-[18px]
          h-4.5
          px-1
          rounded-full
          bg-red-500
          text-white
          text-[10px]
          font-bold
          flex
          items-center
          justify-center
          border-2
          border-white
        "
              >
                {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
              </span>
            )}
          </div>

          <span className="hidden sm:inline font-bold">{t("publicSpace.chat.message")}</span>
        </button>
      )}

      {/* ======================================
          CHAT WINDOW
      ====================================== */}

      {isOpen && (
        <div
          className="
            fixed
            bottom-2
            right-2
            sm:bottom-5
            sm:right-5
            z-[100]
            flex
            w-[720px]
            max-w-[calc(100vw-16px)]
            sm:max-w-[calc(100vw-32px)]
            h-[80vh]
            sm:h-[520px]
            max-h-[calc(100vh-20px)]
            overflow-hidden
            rounded-xl
            sm:rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-2xl
          "
        >
          {/* ==================================
              LEFT
          ================================== */}

          <div
            className={`
              w-[280px]
              shrink-0
              border-r
              border-gray-200
              flex
              flex-col
              bg-white
              ${selectedUserId ? "hidden md:flex" : "flex w-full md:w-[280px]"}
            `}
          >
            {/* HEADER */}

            <div className="px-5 pt-5 pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-gray-900">{t("publicSpace.chat.messagesTitle")}</h2>

                  <MessageCircle size={19} className="text-green-500" />
                </div>

                <button
                  type="button"
                  onClick={closeChat}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-500"
                >
                  <X size={19} />
                </button>
              </div>

              {/* SEARCH */}

              <div className="relative mt-4">
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
                  placeholder={t("publicSpace.chat.searchUserPlaceholder")}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="
                    w-full
                    h-10
                    rounded-lg
                    border
                    border-gray-200
                    bg-white
                    pl-9
                    pr-3
                    text-sm
                    text-gray-800
                    outline-none
                    focus:ring-2
                    focus:ring-green-400
                  "
                />
              </div>
            </div>

            {/* LIST */}

            <div className="flex-1 min-h-0 overflow-y-auto">
              {/* SEARCH RESULTS */}

              {isSearching ? (
                <>
                  {searchLoading ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-sm text-gray-500">{t("publicSpace.chat.searching")}</p>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      <div className="px-4 py-2">
                        <p className="text-xs font-semibold text-gray-500 uppercase">
                          {t("publicSpace.chat.usersHeader")}
                        </p>
                      </div>

                      {searchResults.map((user) => (
                        <button
                          key={String(user._id || user.id)}
                          type="button"
                          onClick={() => {
                            setSearch("");
                            setSearchResults([]);
                            openConversation(user);
                          }}
                          className="
                              w-full
                              flex
                              items-center
                              gap-3
                              px-4
                              py-3
                              text-left
                              hover:bg-gray-50
                              transition
                            "
                        >
                          {user.photo ? (
                            <img
                              src={
                                user.photo.startsWith("http")
                                  ? user.photo
                                  : `${API_URL}${user.photo}`
                              }
                              alt={user.name}
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
                                  shrink-0
                                  rounded-full
                                  bg-green-500
                                  text-white
                                  flex
                                  items-center
                                  justify-center
                                  font-semibold
                                "
                            >
                              {user.name?.charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <p className="font-semibold text-sm text-gray-900 truncate">
                              {user.name}
                            </p>

                            <p className="text-xs text-gray-500 truncate">
                              {user.email}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="h-full flex items-center justify-center px-6 text-center">
                      <p className="text-sm text-gray-500">{t("publicSpace.chat.noUsers")}</p>
                    </div>
                  )}
                </>
              ) : filteredConversations.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center px-6 text-center">
                  <MessageCircle size={32} className="text-green-500 mb-3" />

                  <p className="font-semibold text-gray-800">{t("publicSpace.chat.noMessages")}</p>

                  <p className="text-xs text-gray-500 mt-1">
                    {t("publicSpace.chat.startChatPrompt")}
                  </p>
                </div>
              ) : (
                filteredConversations.map((conversation, index) => {
                  const user = getUserFromConversation(conversation);

                  if (!user) {
                    return null;
                  }

                  const userId = user._id || user.id || `user-${index}`;

                  const lastMessage = getLastMessage(conversation);

                  const lastText = getMessageText(lastMessage);

                  const unreadCount = conversation.unreadCount || 0;

                  return (
                    <button
                      key={String(userId)}
                      type="button"
                      onClick={() => openConversation(user)}
                      className={`
                          w-full
                          flex
                          items-center
                          gap-3
                          px-4
                          py-3
                          text-left
                          transition
                          ${
                            selectedUserId === String(userId)
                              ? "bg-green-50"
                              : "hover:bg-gray-50"
                          }
                        `}
                    >
                      {user.photo ? (
                        <img
                          src={
                            user.photo.startsWith("http")
                              ? user.photo
                              : `${API_URL}${user.photo}`
                          }
                          alt={user.name}
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
                              shrink-0
                              rounded-full
                              bg-green-500
                              text-white
                              flex
                              items-center
                              justify-center
                              font-semibold
                            "
                        >
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p
                            className={`
                                text-sm
                                truncate
                                ${
                                  unreadCount > 0
                                    ? "font-bold text-gray-900"
                                    : "font-semibold text-gray-900"
                                }
                              `}
                          >
                            {user.name}
                          </p>

                          {unreadCount > 0 && (
                            <span
                              className="
                                  min-w-[20px]
                                  h-5
                                  px-1
                                  rounded-full
                                  bg-red-500
                                  text-white
                                  text-[10px]
                                  font-bold
                                  flex
                                  items-center
                                  justify-center
                                "
                            >
                              {unreadCount > 99 ? "99+" : unreadCount}
                            </span>
                          )}
                        </div>

                        <p
                          className={`
                              text-xs
                              truncate
                              mt-0.5
                              ${
                                unreadCount > 0
                                  ? "font-semibold text-gray-700"
                                  : "text-gray-500"
                              }
                            `}
                        >
                          {lastMessage?.messageType === "post"
                            ? t("publicSpace.chat.sharedPostPreview")
                            : lastText || t("publicSpace.chat.startChatting")}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* ==================================
              RIGHT
          ================================== */}

          <div
            className={`
              flex-1
              min-w-0
              min-h-0
              flex-col
              bg-[#f8faf9]
              ${selectedUser ? "flex" : "hidden md:flex"}
            `}
          >
            {!selectedUser ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageCircle
                    size={40}
                    className="mx-auto text-green-500 mb-4"
                  />

                  <h3 className="text-lg font-semibold text-gray-800">
                    {t("publicSpace.chat.yourMessages")}
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {t("publicSpace.chat.selectConversation")}
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* CHAT HEADER */}

                <div
                  className="
                    h-[68px]
                    shrink-0
                    bg-white
                    border-b
                    border-gray-200
                    flex
                    items-center
                    px-4
                    gap-3
                  "
                >
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedUserId(null);

                      setSelectedUser(null);

                      setMessages([]);
                    }}
                    className="
                      md:hidden
                      p-2
                      rounded-full
                      hover:bg-gray-100
                    "
                  >
                    <ArrowLeft size={20} />
                  </button>

                  {selectedUser.photo ? (
                    <img
                      src={
                        selectedUser.photo.startsWith("http")
                          ? selectedUser.photo
                          : `${API_URL}${selectedUser.photo}`
                      }
                      alt={selectedUser.name}
                      className="
                        w-10
                        h-10
                        rounded-full
                        object-cover
                      "
                    />
                  ) : (
                    <div
                      className="
                        w-10
                        h-10
                        rounded-full
                        bg-green-500
                        text-white
                        flex
                        items-center
                        justify-center
                        font-semibold
                      "
                    >
                      {selectedUser.name?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm truncate">
                      {selectedUser.name}
                    </h3>

                    <p className="text-xs text-green-500">{t("publicSpace.chat.activeNow")}</p>
                  </div>

                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <MoveVertical size={19} />
                  </button>
                </div>

                {/* ==================================
                    MESSAGES
                ================================== */}

                <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5">
                  {messages.length === 0 ? (
                    <div className="h-full flex items-center justify-center text-center">
                      <div>
                        <MessageCircle
                          size={30}
                          className="mx-auto text-green-500 mb-3"
                        />

                        <p className="text-sm font-medium text-gray-700">
                          {t("publicSpace.chat.sayHelloTo")} {selectedUser.name}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {t("publicSpace.chat.startConversation")}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {messages.map((message, index) => (
                        <MessageBubble
                          key={message._id || message.id || `message-${index}`}
                          message={message}
                          currentUserId={currentUserId}
                          onOpenPost={onOpenPost}
                        />
                      ))}

                      <div ref={messagesEndRef} className="h-px" />
                    </div>
                  )}
                </div>

                {/* INPUT */}

                <div className="shrink-0 bg-white border-t border-gray-200 p-3">
                  <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1.5">
                    <input
                      type="text"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      placeholder={`${t("publicSpace.chat.messageUser")} ${selectedUser.name}...`}
                      className="
                        flex-1
                        bg-transparent
                        px-3
                        py-2
                        text-sm
                        text-gray-800
                        outline-none
                      "
                    />

                    <button
                      type="button"
                      onClick={sendMessage}
                      disabled={!text.trim() || loading}
                      className="
                        w-9
                        h-9
                        shrink-0
                        rounded-full
                        bg-green-500
                        text-white
                        flex
                        items-center
                        justify-center
                        disabled:opacity-40
                        hover:bg-green-600
                        transition
                      "
                    >
                      <Send size={17} />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
