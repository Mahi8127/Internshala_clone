"use client";
import { MessageCircle, Search } from "lucide-react";
import React, { useEffect, useState } from "react";

const API_URL = "http://localhost:5000";

interface User {
  _id: string;
  name: string;
  email?: string;
  photo?: string;
}

interface Conversation {
  user: User;
  lastMessage: {
    text: string;
    messageType: string;
    createdAt: string;
  };
}

interface ConversationListProps {
  currentUserId: string;
  selectedUserId: string | null;
  onSelectConversation: (userId: string, userName: string) => void;
}

const ConversationList = ({
  currentUserId,
  selectedUserId,
  onSelectConversation,
}: ConversationListProps) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/messages/conversations/${currentUserId}`,
      );
      const data = await response.json();

      if (data.success) {
        setConversations(data.conversation || []);
      }
    } catch (error) {
      console.error("Error fetching Conversations: ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId]);

  const filteredConversations = conversations.filter((conversation) =>
    conversation.user.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="h-full flex flex-col bg-white">
      {/* HEADER */}
      <div className="px-5 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <MessageCircle size={23} className="text-green-600" />
        </div>

        {/* Search */}
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* CONVERSATIONS */}
      <div className="flex-1 overflow-y-auto">
        {loading && (
          <div className="p-5 text-center text-gray-500">
            Loading conversations...
          </div>
        )}

        {!loading && filteredConversations.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full px-6 text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <MessageCircle size={30} className="text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-800">
              No conversations yet
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Start chatting with someone to see your conversations here.
            </p>
          </div>
        )}

        {filteredConversations.map((conversation) => {
          const user = conversation.user;
          const lastMessage = conversation.lastMessage;

          return (
            <button
              key={user._id}
              type="button"
              onClick={() => onSelectConversation(user._id, user.name)}
              className={`w-full flex items-center gap-3 px-5 py-4 text-left transition hover:bg-gray-50 ${
                selectedUserId === user._id ? "bg-green-50" : ""
              }`}
            >
              {/* PROFILE */}
              {user.photo ? (
                <img
                  src={
                    user.photo.startsWith("http")
                      ? user.photo
                      : `${API_URL}${user.photo}`
                  }
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-lg">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              {/* DETAILS */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {user.name}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 truncate mt-1">
                  {lastMessage.messageType === "post"
                    ? "Shared a post"
                    : lastMessage.text}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ConversationList;
