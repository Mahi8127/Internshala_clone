// // 1.  chat
// // 2,  conversation list
// // 3. chatwindow
// // 4.  message bubble
// // 5. message notification

// // Chat.tsx

// "use client";

// import React, { useCallback, useEffect, useRef, useState } from "react";

// import {
//   MessageCircle,
//   X,
//   ArrowLeft,
//   Search,
//   Send,
//   MoreVertical,
// } from "lucide-react";

// import MessageBubble from "./MessageBubble";
// import MessageNotification from "./MessageNotification";

// const API_URL = "http://internshala-backend-5ycp.onrender.com/";

// interface ChatProps {
//   currentUserId: string;
// }

// interface User {
//   _id: string;
//   id?: string;
//   name: string;
//   email?: string;
//   photo?: string;
//   profilePicture?: string;
//   avatar?: string;
// }

// interface Message {
//   _id?: string;
//   id?: string;

//   sender?:
//     | string
//     | {
//         _id?: string;
//         id?: string;
//         name?: string;
//       };

//   receiver?:
//     | string
//     | {
//         _id?: string;
//         id?: string;
//       };

//   text?: string;
//   message?: string;
//   content?: string;

//   messageType?: string;
//   createdAt?: string;
// }

// interface Conversation {
//   user?: User;

//   lastMessage?: Message;

//   _id?: string;
//   id?: string;

//   sender?: any;
//   receiver?: any;

//   text?: string;
//   message?: string;
//   content?: string;

//   createdAt?: string;
// }

// interface NotificationData {
//   messageId: string;
//   senderId: string;
//   senderName: string;
//   message: string;
// }

// const Chat = ({ currentUserId }: ChatProps) => {
//   // =====================================================
//   // REFS
//   // =====================================================

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   /**
//    * Stores the latest message ID
//    * we know for every conversation.
//    */
//   const previousMessages = useRef<Map<string, string>>(new Map());

//   /**
//    * Prevents notifications from appearing
//    * for old messages when the page first loads.
//    */
//   const firstConversationLoad = useRef(true);

//   /**
//    * Prevents the same message from
//    * notifying repeatedly.
//    */
//   const notifiedMessages = useRef<Set<string>>(new Set());

//   // =====================================================
//   // STATE
//   // =====================================================

//   const [isOpen, setIsOpen] = useState(false);

//   const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   const [conversations, setConversations] = useState<Conversation[]>([]);

//   const [messages, setMessages] = useState<Message[]>([]);

//   const [text, setText] = useState("");

//   const [search, setSearch] = useState("");

//   const [loading, setLoading] = useState(false);

//   // =====================================================
//   // THIS IS THE NOTIFICATION STATE
//   // =====================================================

//   const [notification, setNotification] = useState<NotificationData | null>(
//     null,
//   );

//   // =====================================================
//   // GET ID
//   // =====================================================

//   const getId = (value: any): string | null => {
//     if (!value) return null;

//     if (typeof value === "string") {
//       return value;
//     }

//     return value._id || value.id || null;
//   };

//   // =====================================================
//   // GET MESSAGE TEXT
//   // =====================================================

//   const getMessageText = (message: any): string => {
//     if (!message) return "";

//     return message.text ?? message.message ?? message.content ?? "";
//   };

//   // =====================================================
//   // GET MESSAGE ID
//   // =====================================================

//   const getMessageId = (message: any): string | null => {
//     if (!message) return null;

//     const id = message._id ?? message.id;

//     return id ? String(id) : null;
//   };

//   // =====================================================
//   // GET SENDER ID
//   // =====================================================

//   const getSenderId = (message: any): string | null => {
//     if (!message) return null;

//     return getId(message.sender);
//   };

//   // =====================================================
//   // NORMALIZE MESSAGE
//   // =====================================================

//   const normalizeMessage = (raw: any): Message | null => {
//     if (!raw) return null;

//     return {
//       ...raw,

//       _id: raw._id ?? raw.id,

//       id: raw.id ?? raw._id,

//       sender: raw.sender ?? raw.senderId ?? raw.from,

//       receiver: raw.receiver ?? raw.receiverId ?? raw.to,

//       text: raw.text ?? raw.message ?? raw.content ?? "",

//       message: raw.message,

//       content: raw.content,

//       messageType: raw.messageType ?? raw.type ?? "text",

//       createdAt: raw.createdAt ?? raw.created_at ?? new Date().toISOString(),
//     };
//   };

//   // =====================================================
//   // EXTRACT MESSAGE ARRAY
//   // =====================================================

//   const extractMessages = (data: any): Message[] => {
//     let list: any[] = [];

//     if (Array.isArray(data)) {
//       list = data;
//     } else if (Array.isArray(data?.messages)) {
//       list = data.messages;
//     } else if (Array.isArray(data?.message)) {
//       list = data.message;
//     } else if (Array.isArray(data?.data)) {
//       list = data.data;
//     } else if (Array.isArray(data?.data?.messages)) {
//       list = data.data.messages;
//     } else if (Array.isArray(data?.data?.message)) {
//       list = data.data.message;
//     } else if (data?.data && typeof data.data === "object") {
//       list = [data.data];
//     } else if (data?.message && typeof data.message === "object") {
//       list = [data.message];
//     }

//     return list
//       .map(normalizeMessage)
//       .filter((item): item is Message => item !== null);
//   };

//   // =====================================================
//   // GET USER FROM CONVERSATION
//   // =====================================================

//   const getUserFromConversation = (conversation: Conversation): User | null => {
//     if (conversation.user) {
//       return conversation.user;
//     }

//     const senderId = getId(conversation.sender);

//     const receiverId = getId(conversation.receiver);

//     if (senderId && String(senderId) !== String(currentUserId)) {
//       if (typeof conversation.sender === "object") {
//         return {
//           _id: senderId,
//           name: conversation.sender?.name || "User",
//         };
//       }
//     }

//     if (receiverId && String(receiverId) !== String(currentUserId)) {
//       if (typeof conversation.receiver === "object") {
//         return {
//           _id: receiverId,
//           name: conversation.receiver?.name || "User",
//         };
//       }
//     }

//     return null;
//   };

//   // =====================================================
//   // GET LAST MESSAGE
//   // =====================================================

//   const getLastMessage = (conversation: Conversation): Message | null => {
//     if (conversation.lastMessage) {
//       return conversation.lastMessage;
//     }

//     if (conversation.text || conversation.message || conversation.content) {
//       return {
//         _id: conversation._id,

//         id: conversation.id,

//         sender: conversation.sender,

//         receiver: conversation.receiver,

//         text:
//           conversation.text ??
//           conversation.message ??
//           conversation.content ??
//           "",

//         message: conversation.message,

//         content: conversation.content,

//         createdAt: conversation.createdAt,
//       };
//     }

//     return null;
//   };

//   // =====================================================
//   // FETCH CONVERSATIONS
//   // =====================================================

//   const fetchConversations = useCallback(async () => {
//     try {
//       const response = await fetch(
//         `${API_URL}/api/messages/conversations/${currentUserId}`,
//         {
//           cache: "no-store",
//         },
//       );

//       const data = await response.json();

//       console.log("🔥 CONVERSATIONS RESPONSE:", data);

//       if (!response.ok) {
//         console.error("Conversation API error:", data);
//         return;
//       }

//       if (!data.success) {
//         console.error("Conversation request failed:", data);
//         return;
//       }

//       let list = data.conversation ?? data.conversations ?? data.data ?? [];

//       if (!Array.isArray(list) && Array.isArray(list?.conversations)) {
//         list = list.conversations;
//       }

//       if (!Array.isArray(list)) {
//         list = [];
//       }

//       setConversations(list);

//       // =================================================
//       // FIRST LOAD
//       // =================================================

//       if (firstConversationLoad.current) {
//         list.forEach((conversation: Conversation) => {
//           const user = getUserFromConversation(conversation);

//           const lastMessage = getLastMessage(conversation);

//           if (!user || !lastMessage) {
//             return;
//           }

//           const userId = getId(user);

//           const messageId = getMessageId(lastMessage);

//           if (userId && messageId) {
//             previousMessages.current.set(String(userId), messageId);
//           }
//         });

//         firstConversationLoad.current = false;

//         return;
//       }

//       // =================================================
//       // CHECK FOR NEW MESSAGES
//       // =================================================

//       list.forEach((conversation: Conversation) => {
//         const user = getUserFromConversation(conversation);

//         const lastMessage = getLastMessage(conversation);

//         if (!user || !lastMessage) {
//           return;
//         }

//         const userId = getId(user);

//         const messageId = getMessageId(lastMessage);

//         const senderId = getSenderId(lastMessage);

//         const messageText = getMessageText(lastMessage);

//         if (!userId || !messageId || !senderId || !messageText) {
//           return;
//         }

//         // Don't notify for own messages
//         if (String(senderId) === String(currentUserId)) {
//           previousMessages.current.set(String(userId), messageId);

//           return;
//         }

//         const previousId = previousMessages.current.get(String(userId));

//         // =================================================
//         // NEW MESSAGE
//         // =================================================

//         if (
//           previousId !== messageId &&
//           !notifiedMessages.current.has(messageId)
//         ) {
//           notifiedMessages.current.add(messageId);

//           setNotification({
//             messageId,
//             senderId,
//             senderName: user.name || "New message",
//             message: messageText,
//           });
//         }

//         previousMessages.current.set(String(userId), messageId);
//       });
//     } catch (error) {
//       console.error("🔥 FETCH CONVERSATIONS ERROR:", error);
//     }
//   }, [currentUserId]);

//   // =====================================================
//   // FETCH MESSAGES
//   // =====================================================

//   const fetchMessages = useCallback(async () => {
//     if (!selectedUserId) {
//       return;
//     }

//     try {
//       const response = await fetch(
//         `${API_URL}/api/messages/${currentUserId}/${selectedUserId}`,
//         {
//           cache: "no-store",
//         },
//       );

//       const data = await response.json();

//       console.log("🔥 FETCH MESSAGES RESPONSE:", data);

//       if (!response.ok || !data.success) {
//         console.error("Message API error:", data);
//         return;
//       }

//       const serverMessages = extractMessages(data);

//       setMessages(serverMessages);
//     } catch (error) {
//       console.error("🔥 FETCH MESSAGES ERROR:", error);
//     }
//   }, [currentUserId, selectedUserId]);

//   // =====================================================
//   // OPEN CONVERSATION
//   // =====================================================

//   const openConversation = async (user: User) => {
//     const userId = user._id || user.id;

//     if (!userId) {
//       return;
//     }

//     // Remove notification
//     setNotification(null);

//     setIsOpen(true);

//     setSelectedUserId(String(userId));

//     setSelectedUser(user);

//     setMessages([]);

//     try {
//       const response = await fetch(
//         `${API_URL}/api/messages/${currentUserId}/${userId}`,
//         {
//           cache: "no-store",
//         },
//       );

//       const data = await response.json();

//       console.log("🔥 OPEN CHAT RESPONSE:", data);

//       if (!response.ok || !data.success) {
//         return;
//       }

//       const serverMessages = extractMessages(data);

//       setMessages(serverMessages);
//     } catch (error) {
//       console.error("Open conversation error:", error);
//     }
//   };

//   // =====================================================
//   // INITIAL + REAL-TIME POLLING
//   // =====================================================

//   useEffect(() => {
//     if (!currentUserId) {
//       return;
//     }

//     fetchConversations();

//     const interval = setInterval(() => {
//       fetchConversations();
//     }, 1500);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [currentUserId, fetchConversations]);

//   // =====================================================
//   // CURRENT CHAT POLLING
//   // =====================================================

//   useEffect(() => {
//     if (!isOpen || !selectedUserId) {
//       return;
//     }

//     fetchMessages();

//     const interval = setInterval(() => {
//       fetchMessages();
//     }, 1500);

//     return () => {
//       clearInterval(interval);
//     };
//   }, [isOpen, selectedUserId, fetchMessages]);

//   // =====================================================
//   // AUTO SCROLL
//   // =====================================================

//   useEffect(() => {
//     if (!selectedUserId) {
//       return;
//     }

//     requestAnimationFrame(() => {
//       messagesEndRef.current?.scrollIntoView({
//         behavior: "smooth",
//         block: "end",
//       });
//     });
//   }, [messages, selectedUserId]);

//   // =====================================================
//   // SEND MESSAGE
//   // =====================================================

//   const sendMessage = async () => {
//     if (!text.trim() || !selectedUserId || loading) {
//       return;
//     }

//     const messageText = text.trim();

//     setText("");

//     setLoading(true);

//     try {
//       const response = await fetch(`${API_URL}/api/messages/send`, {
//         method: "POST",

//         headers: {
//           "Content-Type": "application/json",
//         },

//         body: JSON.stringify({
//           sender: currentUserId,

//           receiver: selectedUserId,

//           text: messageText,

//           messageType: "text",
//         }),
//       });

//       const data = await response.json();

//       console.log("🔥 SEND MESSAGE RESPONSE:", data);

//       if (!response.ok) {
//         console.error("Send message error:", data);

//         setText(messageText);

//         return;
//       }

//       if (!data.success) {
//         console.error("Message send failed:", data);

//         setText(messageText);

//         return;
//       }

//       // =================================================
//       // MESSAGE RETURNED FROM BACKEND
//       // =================================================

//       const returnedMessages = extractMessages(data);

//       if (returnedMessages.length > 0) {
//         setMessages((previous) => {
//           const existingIds = new Set(
//             previous.map((message) => getMessageId(message)).filter(Boolean),
//           );

//           const newMessages = returnedMessages.filter((message) => {
//             const id = getMessageId(message);

//             if (!id) {
//               return true;
//             }

//             return !existingIds.has(id);
//           });

//           return [...previous, ...newMessages];
//         });
//       } else {
//         // =================================================
//         // LOCAL FALLBACK
//         // =================================================

//         const temporaryMessage: Message = {
//           id: `temporary-${Date.now()}`,

//           sender: currentUserId,

//           receiver: selectedUserId,

//           text: messageText,

//           messageType: "text",

//           createdAt: new Date().toISOString(),
//         };

//         setMessages((previous) => [...previous, temporaryMessage]);
//       }

//       // Refresh conversation list
//       await fetchConversations();

//       // Get server version
//       setTimeout(() => {
//         fetchMessages();
//       }, 300);
//     } catch (error) {
//       console.error("🔥 SEND MESSAGE ERROR:", error);

//       setText(messageText);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =====================================================
//   // CLOSE CHAT
//   // =====================================================

//   const closeChat = () => {
//     setIsOpen(false);

//     setSelectedUserId(null);

//     setSelectedUser(null);

//     setMessages([]);

//     setText("");
//   };

//   // =====================================================
//   // NOTIFICATION CLICK
//   // =====================================================

//   const handleNotificationClick = async () => {
//     if (!notification) {
//       return;
//     }

//     const senderId = notification.senderId;

//     setNotification(null);

//     // Find sender in conversations
//     const conversation = conversations.find((item) => {
//       const user = getUserFromConversation(item);

//       if (!user) {
//         return false;
//       }

//       const userId = getId(user);

//       return String(userId) === String(senderId);
//     });

//     if (conversation) {
//       const user = getUserFromConversation(conversation);

//       if (user) {
//         await openConversation(user);

//         return;
//       }
//     }

//     // If conversation isn't currently
//     // in state, refresh it first.
//     await fetchConversations();
//   };

//   // =====================================================
//   // FILTER
//   // =====================================================

//   const filteredConversations = conversations.filter((conversation) => {
//     const user = getUserFromConversation(conversation);

//     return user?.name?.toLowerCase().includes(search.toLowerCase()) ?? false;
//   });

//   // =====================================================
//   // RENDER
//   // =====================================================

//   return (
//     <>
//       {/* ===================================================
//           TOP MESSAGE NOTIFICATION
//       =================================================== */}

//       {notification && (
//         <MessageNotification
//           senderName={notification.senderName}
//           message={notification.message}
//           onClick={handleNotificationClick}
//           onClose={() => setNotification(null)}
//         />
//       )}

//       {/* ===================================================
//           FLOATING CHAT BUTTON
//       =================================================== */}

//       {!isOpen && (
//         <button
//           type="button"
//           onClick={() => {
//             setIsOpen(true);
//             fetchConversations();
//           }}
//           className="
//             fixed
//             bottom-6
//             right-6
//             z-[100]
//             w-14
//             h-14
//             rounded-full
//             bg-green-500
//             text-white
//             shadow-xl
//             flex
//             items-center
//             justify-center
//             hover:bg-green-600
//             hover:scale-105
//             transition-all
//           "
//         >
//           <MessageCircle size={26} />
//         </button>
//       )}

//       {/* ===================================================
//           CHAT WINDOW
//       =================================================== */}

//       {isOpen && (
//         <div
//           className="
//             fixed
//             bottom-5
//             right-5
//             z-[100]
//             w-[720px]
//             max-w-[calc(100vw-32px)]
//             h-[520px]
//             max-h-[calc(100vh-40px)]
//             bg-white
//             rounded-2xl
//             shadow-2xl
//             border
//             border-gray-200
//             overflow-hidden
//             flex
//           "
//         >
//           {/* =================================================
//               LEFT SIDE
//           ================================================= */}

//           <div
//             className={`
//               w-[280px]
//               shrink-0
//               border-r
//               border-gray-200
//               flex
//               flex-col
//               bg-white

//               ${selectedUserId ? "hidden md:flex" : "flex w-full md:w-[280px]"}
//             `}
//           >
//             {/* HEADER */}

//             <div
//               className="px-5 pt-5 pb-4">
//               <div className="flex  items-center  justify-between">
//                 <div className="flex items-center gap-2">
//                   <h2 className="text-xl font-bold text-gray-900">
//                     Messages
//                   </h2>
//                   <MessageCircle size={19} className="text-green-500" />
//                 </div>

//                 <button
//                   type="button"
//                   onClick={closeChat}
//                   className="
//                     p-2
//                     rounded-full
//                     hover:bg-gray-100
//                     text-gray-500
//                   "
//                 >
//                   <X size={19} />
//                 </button>
//               </div>

//               {/* SEARCH */}

//               <div
//                 className="
//                   relative
//                   mt-4
//                 "
//               >
//                 <Search
//                   size={17}
//                   className="
//                     absolute
//                     left-3
//                     top-1/2
//                     -translate-y-1/2
//                     text-gray-400
//                   "
//                 />

//                 <input
//                   type="text"
//                   placeholder="Search messages"
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   className="
//                     w-full
//                     h-10
//                     bg-gray-100
//                     rounded-lg
//                     pl-9
//                     pr-3
//                     text-sm
//                     outline-none
//                     focus:ring-2
//                     focus:ring-green-400
//                     focus:bg-white
//                   "
//                 />
//               </div>
//             </div>

//             {/* CONVERSATIONS */}

//             <div
//               className="
//                 flex-1
//                 min-h-0
//                 overflow-y-auto
//               "
//             >
//               {filteredConversations.length === 0 ? (
//                 <div
//                   className="
//                     h-full
//                     flex
//                     flex-col
//                     items-center
//                     justify-center
//                     px-6
//                     text-center
//                   "
//                 >
//                   <MessageCircle
//                     size={32}
//                     className="
//                       text-green-500
//                       mb-3
//                     "
//                   />

//                   <p
//                     className="
//                       font-semibold
//                       text-gray-800
//                     "
//                   >
//                     No messages yet
//                   </p>

//                   <p
//                     className="
//                       text-xs
//                       text-gray-500
//                       mt-1
//                     "
//                   >
//                     Start a conversation.
//                   </p>
//                 </div>
//               ) : (
//                 filteredConversations.map((conversation, index) => {
//                   const user = getUserFromConversation(conversation);

//                   if (!user) {
//                     return null;
//                   }

//                   const userId = user._id || user.id || `user-${index}`;

//                   const lastMessage = getLastMessage(conversation);

//                   const lastText = lastMessage
//                     ? getMessageText(lastMessage)
//                     : "";

//                   return (
//                     <button
//                       key={String(userId)}
//                       type="button"
//                       onClick={() => openConversation(user)}
//                       className={`
//                           w-full
//                           flex
//                           items-center
//                           gap-3
//                           px-4
//                           py-3
//                           text-left
//                           hover:bg-gray-50
//                           transition

//                           ${
//                             selectedUserId === String(userId)
//                               ? "bg-green-50"
//                               : ""
//                           }
//                         `}
//                     >
//                       {/* AVATAR */}

//                       {user.photo || user.profilePicture || user.avatar ? (
//                         <img
//                           src={user.photo || user.profilePicture || user.avatar}
//                           alt={user.name}
//                           className="
//                               w-11
//                               h-11
//                               rounded-full
//                               object-cover
//                               shrink-0
//                             "
//                         />
//                       ) : (
//                         <div
//                           className="
//                               w-11
//                               h-11
//                               shrink-0
//                               rounded-full
//                               bg-green-500
//                               text-white
//                               flex
//                               items-center
//                               justify-center
//                               font-semibold
//                             "
//                         >
//                           {user.name?.charAt(0).toUpperCase()}
//                         </div>
//                       )}

//                       {/* DETAILS */}

//                       <div
//                         className="
//                             flex-1
//                             min-w-0
//                           "
//                       >
//                         <p
//                           className="
//                               font-semibold
//                               text-sm
//                               text-gray-900
//                               truncate
//                             "
//                         >
//                           {user.name}
//                         </p>

//                         <p
//                           className="
//                               text-xs
//                               text-gray-500
//                               truncate
//                               mt-0.5
//                             "
//                         >
//                           {lastMessage?.messageType === "post"
//                             ? "📷 Shared a post"
//                             : lastText || "Start chatting"}
//                         </p>
//                       </div>
//                     </button>
//                   );
//                 })
//               )}
//             </div>
//           </div>

//           {/* =================================================
//               RIGHT SIDE
//           ================================================= */}

//           <div
//             className={`
//               flex-1
//               min-w-0
//               min-h-0
//               flex-col
//               bg-[#f8faf9]

//               ${selectedUserId ? "flex" : "hidden md:flex"}
//             `}
//           >
//             {!selectedUser ? (
//               <div
//                 className="
//                   flex-1
//                   flex
//                   items-center
//                   justify-center
//                 "
//               >
//                 <div
//                   className="
//                     text-center
//                   "
//                 >
//                   <MessageCircle
//                     size={40}
//                     className="
//                       mx-auto
//                       text-green-500
//                       mb-4
//                     "
//                   />

//                   <h3
//                     className="
//                       text-lg
//                       font-semibold
//                       text-gray-800
//                     "
//                   >
//                     Your Messages
//                   </h3>

//                   <p
//                     className="
//                       text-sm
//                       text-gray-500
//                       mt-1
//                     "
//                   >
//                     Select a conversation.
//                   </p>
//                 </div>
//               </div>
//             ) : (
//               <>
//                 {/* =================================================
//                     CHAT HEADER
//                 ================================================= */}

//                 <div
//                   className="
//                     h-[68px]
//                     shrink-0
//                     bg-white
//                     border-b
//                     border-gray-200
//                     flex
//                     items-center
//                     px-4
//                     gap-3
//                   "
//                 >
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setSelectedUserId(null);

//                       setSelectedUser(null);

//                       setMessages([]);
//                     }}
//                     className="
//                       md:hidden
//                       p-2
//                       rounded-full
//                       hover:bg-gray-100
//                     "
//                   >
//                     <ArrowLeft size={20} />
//                   </button>

//                   {/* AVATAR */}

//                   {selectedUser.photo ||
//                   selectedUser.profilePicture ||
//                   selectedUser.avatar ? (
//                     <img
//                       src={
//                         selectedUser.photo ||
//                         selectedUser.profilePicture ||
//                         selectedUser.avatar
//                       }
//                       alt={selectedUser.name}
//                       className="
//                         w-10
//                         h-10
//                         rounded-full
//                         object-cover
//                       "
//                     />
//                   ) : (
//                     <div
//                       className="
//                         w-10
//                         h-10
//                         rounded-full
//                         bg-green-500
//                         text-white
//                         flex
//                         items-center
//                         justify-center
//                         font-semibold
//                       "
//                     >
//                       {selectedUser.name?.charAt(0).toUpperCase()}
//                     </div>
//                   )}

//                   <div
//                     className="
//                       flex-1
//                       min-w-0
//                     "
//                   >
//                     <h3
//                       className="
//                         font-semibold
//                         text-gray-900
//                         text-sm
//                         truncate
//                       "
//                     >
//                       {selectedUser.name}
//                     </h3>

//                     <p
//                       className="
//                         text-xs
//                         text-green-500
//                       "
//                     >
//                       Active now
//                     </p>
//                   </div>

//                   <button
//                     type="button"
//                     className="
//                       p-2
//                       rounded-full
//                       hover:bg-gray-100
//                     "
//                   >
//                     <MoreVertical size={19} />
//                   </button>
//                 </div>

//                 {/* =================================================
//                     MESSAGE AREA
//                 ================================================= */}

//                 <div
//                   className="
//                     flex-1
//                     min-h-0
//                     overflow-y-auto
//                     px-4
//                     py-5
//                   "
//                 >
//                   {messages.length === 0 ? (
//                     <div
//                       className="
//                         h-full
//                         min-h-[300px]
//                         flex
//                         items-center
//                         justify-center
//                         text-center
//                       "
//                     >
//                       <div>
//                         <MessageCircle
//                           size={30}
//                           className="
//                             mx-auto
//                             text-green-500
//                             mb-3
//                           "
//                         />

//                         <p
//                           className="
//                             text-sm
//                             font-medium
//                             text-gray-700
//                           "
//                         >
//                           Say hello to {selectedUser.name} 👋
//                         </p>

//                         <p
//                           className="
//                             text-xs
//                             text-gray-400
//                             mt-1
//                           "
//                         >
//                           Start the conversation.
//                         </p>
//                       </div>
//                     </div>
//                   ) : (
//                     <div
//                       className="
//                         flex
//                         flex-col
//                         gap-2
//                       "
//                     >
//                       {messages.map((message, index) => (
//                         <MessageBubble
//                           key={message._id || message.id || `message-${index}`}
//                           message={message}
//                           currentUserId={currentUserId}
//                         />
//                       ))}

//                       {/* AUTO SCROLL TARGET */}

//                       <div ref={messagesEndRef} className="h-px" />
//                     </div>
//                   )}
//                 </div>

//                 {/* =================================================
//                     INPUT
//                 ================================================= */}

//                 <div
//                   className="
//                     shrink-0
//                     bg-white
//                     border-t
//                     border-gray-200
//                     p-3
//                   "
//                 >
//                   <div
//                     className="
//                       flex
//                       items-center
//                       gap-2
//                       bg-gray-100
//                       rounded-full
//                       px-2
//                       py-1.5
//                     "
//                   >
//                     <input
//                       type="text"
//                       value={text}
//                       onChange={(e) => setText(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter" && !e.shiftKey) {
//                           e.preventDefault();

//                           sendMessage();
//                         }
//                       }}
//                       placeholder={`Message ${selectedUser.name}...`}
//                       className="
//                         flex-1
//                         bg-transparent
//                         px-3
//                         py-2
//                         text-sm
//                         outline-none
//                       "
//                     />

//                     <button
//                       type="button"
//                       onClick={sendMessage}
//                       disabled={!text.trim() || loading}
//                       className="
//                         w-9
//                         h-9
//                         shrink-0
//                         rounded-full
//                         bg-green-500
//                         text-white
//                         flex
//                         items-center
//                         justify-center
//                         disabled:opacity-40
//                         hover:bg-green-600
//                         transition
//                       "
//                     >
//                       <Send size={17} />
//                     </button>
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Chat;

// // MessageNotification.tsx

// // chatwindow
// ("use client");

// import React, { useEffect, useRef, useState } from "react";
// import { ArrowLeft, MoreVertical, Send, MessageCircle } from "lucide-react";
// import MessageBubble from "./MessageBubble";

// const API_URL = "http://internshala-backend-5ycp.onrender.com/";

// interface User {
//   _id: string;
//   name: string;
//   photo?: string;
// }

// interface ChatWindowProps {
//   currentUserId: string;
//   selectedUserId: string | null;
//   selectedUserName: string;
//   onBack: () => void;
// }

// const ChatWindow = ({
//   currentUserId,
//   selectedUserId,
//   selectedUserName,
//   onBack,
// }: ChatWindowProps) => {
//   const [messages, setMessages] = useState<any[]>([]);
//   const [text, setText] = useState("");
//   const [loading, setLoading] = useState(false);

//   const messagesEndRef = useRef<HTMLDivElement>(null);

//   // =========================
//   // FETCH MESSAGES
//   // =========================

//   const fetchMessages = async () => {
//     if (!selectedUserId) return;

//     try {
//       const response = await fetch(
//         `${API_URL}/api/messages/${currentUserId}/${selectedUserId}`,
//       );

//       const data = await response.json();

//       console.log("CHAT API RESPONSE:", data);

//       if (!response.ok) {
//         console.error("API error:", data);
//         return;
//       }

//       if (data.success) {
//         const fetchedMessages =
//           data.message || data.messages || data.data || [];

//         console.log("FINAL MESSAGES:", fetchedMessages);

//         setMessages(fetchedMessages);
//       }
//     } catch (error) {
//       console.error("Fetch messages error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchMessages();
//   }, [selectedUserId, currentUserId]);

//   // =========================
//   // AUTO SCROLL
//   // =========================

//   useEffect(() => {
//     messagesEndRef.current?.scrollIntoView({
//       behavior: "smooth",
//     });
//   }, [messages]);

//   // =========================
//   // SEND MESSAGE
//   // =========================

//   const sendMessage = async () => {
//     if (!text.trim() || !selectedUserId || loading) {
//       return;
//     }

//     const messageText = text.trim();

//     setText("");
//     setLoading(true);

//     try {
//       const response = await fetch(`${API_URL}/api/messages/send`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           sender: currentUserId,
//           receiver: selectedUserId,
//           text: messageText,
//           messageType: "text",
//         }),
//       });

//       const data = await response.json();

//       console.log("SEND MESSAGE:", data);

//       if (data.success) {
//         setMessages((prev) => [...prev, data.data]);
//       }
//     } catch (error) {
//       console.error("Send message error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // =========================
//   // NO USER SELECTED
//   // =========================

//   if (!selectedUserId) {
//     return (
//       <div className="h-full flex items-center justify-center bg-gray-50">
//         <div className="text-center">
//           <div className="w-16 h-16 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-4">
//             <MessageCircle size={28} className="text-green-500" />
//           </div>

//           <h3 className="font-semibold text-gray-800">Your Messages</h3>

//           <p className="text-sm text-gray-500 mt-1">
//             Select a conversation to start chatting.
//           </p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="h-full flex flex-col bg-[#f8faf9]">
//       {/* ================= HEADER ================= */}

//       <div className="h-[68px] shrink-0 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
//         <button
//           type="button"
//           onClick={onBack}
//           className="md:hidden p-2 rounded-full hover:bg-gray-100"
//         >
//           <ArrowLeft size={20} />
//         </button>

//         <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold">
//           {selectedUserName?.charAt(0).toUpperCase()}
//         </div>

//         <div className="flex-1">
//           <h3 className="font-semibold text-gray-900">{selectedUserName}</h3>

//           <p className="text-xs text-green-500">Active now</p>
//         </div>

//         <button type="button" className="p-2 rounded-full hover:bg-gray-100">
//           <MoreVertical size={19} />
//         </button>
//       </div>

//       {/* ================= MESSAGES ================= */}

//       <div className="flex-1 overflow-y-auto px-4 py-5 space-y-2">
//         {messages.length === 0 ? (
//           <div className="h-full flex items-center justify-center text-center">
//             <div>
//               <div className="w-14 h-14 mx-auto rounded-full bg-green-50 flex items-center justify-center mb-3">
//                 <MessageCircle size={25} className="text-green-500" />
//               </div>

//               <p className="text-sm font-medium text-gray-700">
//                 Say hello to {selectedUserName} 👋
//               </p>

//               <p className="text-xs text-gray-400 mt-1">
//                 Start the conversation.
//               </p>
//             </div>
//           </div>
//         ) : (
//           messages.map((message) => (
//             <MessageBubble
//               key={message._id}
//               message={message}
//               currentUserId={currentUserId}
//             />
//           ))
//         )}

//         <div ref={messagesEndRef} />
//       </div>

//       {/* ================= INPUT ================= */}

//       <div className="shrink-0 bg-white border-t border-gray-200 p-3">
//         <div className="flex items-center gap-2 bg-gray-100 rounded-full px-2 py-1.5">
//           <input
//             type="text"
//             value={text}
//             onChange={(e) => setText(e.target.value)}
//             onKeyDown={(e) => {
//               if (e.key === "Enter") {
//                 sendMessage();
//               }
//             }}
//             placeholder={`Message ${selectedUserName}...`}
//             className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
//           />

//           <button
//             type="button"
//             onClick={sendMessage}
//             disabled={!text.trim() || loading}
//             className="w-9 h-9 rounded-full bg-green-500 text-white flex items-center justify-center disabled:opacity-40 hover:bg-green-600 transition"
//           >
//             <Send size={17} />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatWindow;

// // MesssageBUbble

// ("use client");

// import React from "react";

// interface MessageBubbleProps {
//   message: {
//     _id?: string;
//     id?: string;

//     sender?:
//       | string
//       | {
//           _id?: string;
//           id?: string;
//           name?: string;
//         };

//     receiver?:
//       | string
//       | {
//           _id?: string;
//           id?: string;
//         };

//     text?: string;
//     message?: string;
//     content?: string;

//     messageType?: string;
//     createdAt?: string;
//   };

//   currentUserId: string;
// }

// const MessageBubble = ({ message, currentUserId }: MessageBubbleProps) => {
//   // =====================================================
//   // GET SENDER ID
//   // =====================================================

//   const senderId =
//     typeof message.sender === "string"
//       ? message.sender
//       : message.sender?._id || message.sender?.id;

//   // =====================================================
//   // CHECK IF MESSAGE IS MINE
//   // =====================================================

//   const isMine = String(senderId) === String(currentUserId);

//   // =====================================================
//   // GET MESSAGE TEXT
//   // =====================================================

//   const messageText = message.text ?? message.message ?? message.content ?? "";

//   // =====================================================
//   // GET TIME
//   // =====================================================

//   let time = "";

//   if (message.createdAt) {
//     const date = new Date(message.createdAt);

//     if (!Number.isNaN(date.getTime())) {
//       time = date.toLocaleTimeString([], {
//         hour: "2-digit",
//         minute: "2-digit",
//       });
//     }
//   }

//   // =====================================================
//   // DEBUG
//   // =====================================================

//   console.log("MESSAGE BUBBLE:", {
//     message,
//     senderId,
//     currentUserId,
//     isMine,
//     messageText,
//   });

//   // =====================================================
//   // RENDER
//   // =====================================================

//   return (
//     <div
//       className={`
//         flex
//         w-full
//         ${isMine ? "justify-end" : "justify-start"}
//       `}
//     >
//       <div
//         className={`
//           max-w-[75%]
//           min-w-[40px]
//           px-4
//           py-2.5
//           rounded-2xl
//           text-sm
//           shadow-sm
//           break-words
//           ${
//             isMine
//               ? `
//                 bg-green-500
//                 text-white
//                 rounded-br-md
//               `
//               : `
//                 bg-white
//                 text-gray-800
//                 border
//                 border-gray-200
//                 rounded-bl-md
//               `
//           }
//         `}
//       >
//         {/* MESSAGE */}

//         {messageText ? (
//           <p
//             className="
//             whitespace-pre-wrap
//             break-words
//             leading-relaxed
//           "
//           >
//             {messageText}
//           </p>
//         ) : (
//           <p
//             className="
//             text-xs
//             opacity-60
//           "
//           >
//             Message
//           </p>
//         )}

//         {/* TIME */}

//         {time && (
//           <p
//             className={`
//               text-[10px]
//               mt-1
//               text-right
//               ${isMine ? "text-green-100" : "text-gray-400"}
//             `}
//           >
//             {time}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MessageBubble;

// // Conversation list
// ("use client");

// import React, { useEffect, useState } from "react";
// import { Search, MessageCircle } from "lucide-react";

// const API_URL = "http://internshala-backend-5ycp.onrender.com/";

// interface User {
//   _id: string;
//   name: string;
//   email?: string;
//   photo?: string;
// }

// interface Conversation {
//   user: User;
//   lastMessage: {
//     text: string;
//     messageType: string;
//     createdAt: string;
//   };
// }

// interface ConversationListProps {
//   currentUserId: string;
//   selectedUserId: string | null;
//   onSelectConversation: (userId: string, userName: string) => void;
// }

// const ConversationList = ({
//   currentUserId,
//   selectedUserId,
//   onSelectConversation,
// }: ConversationListProps) => {
//   const [conversations, setConversations] = useState<Conversation[]>([]);
//   const [search, setSearch] = useState("");
//   const [loading, setLoading] = useState(true);

//   const fetchConversations = async () => {
//     try {
//       const response = await fetch(
//         `${API_URL}/api/messages/conversations/${currentUserId}`,
//       );

//       const data = await response.json();

//       if (data.success) {
//         setConversations(data.conversation || []);
//       }
//     } catch (error) {
//       console.error("Error fetching conversations:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (currentUserId) {
//       fetchConversations();
//     }
//   }, [currentUserId]);

//   const filteredConversations = conversations.filter((conversation) =>
//     conversation.user.name.toLowerCase().includes(search.toLowerCase()),
//   );

//   return (
//     <div className="h-full flex flex-col bg-white">
//       {/* Header */}
//       <div className="px-5 py-5 border-b border-gray-200">
//         <div className="flex items-center justify-between mb-4">
//           <h2 className="text-2xl font-bold text-gray-900">Messages</h2>

//           <MessageCircle size={23} className="text-green-600" />
//         </div>

//         {/* Search */}
//         <div className="relative">
//           <Search
//             size={18}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//           />

//           <input
//             type="text"
//             placeholder="Search conversations..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full bg-gray-100 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
//           />
//         </div>
//       </div>

//       {/* Conversations */}
//       <div className="flex-1 overflow-y-auto">
//         {loading && (
//           <div className="p-5 text-center text-gray-500">
//             Loading conversations...
//           </div>
//         )}

//         {!loading && filteredConversations.length === 0 && (
//           <div className="flex flex-col items-center justify-center h-full px-6 text-center">
//             <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
//               <MessageCircle size={30} className="text-green-600" />
//             </div>

//             <h3 className="font-semibold text-gray-800">
//               No conversations yet
//             </h3>

//             <p className="text-sm text-gray-500 mt-1">
//               Start chatting with someone to see your conversations here.
//             </p>
//           </div>
//         )}

//         {filteredConversations.map((conversation) => {
//           const user = conversation.user;
//           const lastMessage = conversation.lastMessage;

//           return (
//             <button
//               key={user._id}
//               type="button"
//               onClick={() => onSelectConversation(user._id, user.name)}
//               className={`w-full flex items-center gap-3 px-5 py-4 text-left transition hover:bg-gray-50 ${
//                 selectedUserId === user._id ? "bg-green-50" : ""
//               }`}
//             >
//               {/* Profile */}
//               {user.photo ? (
//                 <img
//                   src={
//                     user.photo.startsWith("http")
//                       ? user.photo
//                       : `${API_URL}${user.photo}`
//                   }
//                   alt={user.name}
//                   className="w-12 h-12 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center font-semibold text-lg">
//                   {user.name?.charAt(0).toUpperCase()}
//                 </div>
//               )}

//               {/* Details */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex justify-between items-center">
//                   <h3 className="font-semibold text-gray-900 truncate">
//                     {user.name}
//                   </h3>
//                 </div>

//                 <p className="text-sm text-gray-500 truncate mt-1">
//                   {lastMessage.messageType === "post"
//                     ? "📷 Shared a post"
//                     : lastMessage.text}
//                 </p>
//               </div>
//             </button>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default ConversationList;

export default function Test() {
  return null;
}
