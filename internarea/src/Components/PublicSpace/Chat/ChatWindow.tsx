"use client";
import { strict } from "assert";
import { ArrowLeft, MessageCircle, MoreVertical, Send } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import MessageBubble from "./MessageBubble";

const API_URL = "https://internshala-backend-5ycp.onrender.com";

interface User {
  _id: string;
  name: string;
  photo?: string;
}

interface ChatWindowProps {
  currentUserId: string;
  selectedUserId: string | null;
  selectedUserName: string;
  onBack: () => void;
}

const ChatWindow = ({
  currentUserId,
  selectedUserId,
  selectedUserName,
  onBack,
}: ChatWindowProps) => {
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchMessages = async () => {
    if (!selectedUserId) return;

    try {
      const response = await fetch(
        `${API_URL}/api/messages/${currentUserId}/${selectedUserId}`,
      );
      const data = await response.json();
      console.log("CHAT API RESPONSE: ", data);

      if (!response.ok) {
        console.error("API ERROR: ", data);
        return;
      }
      if (data.success) {
        const fetchedMessages =
          data.message || data.messages || data.data || [];
        console.log("FINAL MESSAGES: ", fetchedMessages);
        setMessages(fetchedMessages);
      }
    } catch (error) {
      console.error("Fetch message error: ", error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [selectedUserId, currentUserId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

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
      console.log("SEND MESSAGE: ", data);

      if (data.success) {
        setMessages((prev) => [...prev, data.data]);
      }
    } catch (error) {
      console.error("Send message error: ", error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedUserId) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
            <MessageCircle size={28} className="text-green-500" />
          </div>

          <h3 className="font-semibold text-gray-800">Your Messages</h3>
          <p className="text-sm text-gray-500 mt-1">
            Select a conversation to start chatting.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="h-full flex flex-col bg-[#f8faf9]">
      {/* HEADER */}
      <div className="h-[68px] shrink-0 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
        <button
          type="button"
          onClick={onBack}
          className="md:hidden p-2 rounded-full hover:bg-gray-100"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
          {selectedUserName?.charAt(0).toUpperCase()}
        </div>

        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{selectedUserName}</h3>
          <p className="text-xs text-green-500">Active now</p>
        </div>

        <button type="button" className="p-2 rounded-full hover:bg-gray-100">
          <MoreVertical size={19} />
        </button>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <div className="w-14 h-14 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-3">
                <MessageCircle size={25} className="text-green-500" />
              </div>

              <p className="text-sm font-medium text-gray-700">
                Say hello to {selectedUserName} 👋
              </p>

              <p className="text-xs text-gray-400 mt-1">
                Start the conversation.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              currentUserId={currentUserId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      <div className="shrink-0 bg-white border-t border-gray-200 p-3">
        <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1.5">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
            placeholder={`Message ${selectedUserName}...`}
            className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!text.trim() || loading}
            className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center disabled:opacity-40 hover:bg-green-600 transition"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatWindow;
