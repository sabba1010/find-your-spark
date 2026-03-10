import { useState, useEffect, useRef } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useSearchParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useSocket } from "../context/SocketContext";

const API = "http://localhost:5000/api";

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  createdAt: string;
}

interface Chat {
  userId: string;
  userName: string;
  userPhoto: string;
  userLocation: string;
  lastMessage: string;
  lastMessageTime: string;
}

export default function Messages() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeMessages, setActiveMessages] = useState<Message[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const location = useLocation();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
  const currentUserId = currentUser.id || currentUser._id;
  const { socket, onlineUsers } = useSocket();

  // Fetch the list of chats for the sidebar
  const fetchChats = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API}/messages/chats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setChats(data.chats);
      }
    } catch (err) {
      console.error("Failed to fetch chats", err);
    }
  };

  // Fetch messages for the currently active chat
  const fetchMessages = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch(`${API}/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setActiveMessages(data.messages);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    }
  };

  // Initial load and URL param handling
  useEffect(() => {
    fetchChats();
    const userId = searchParams.get("user");
    if (userId) {
      setActiveChat(userId);
      fetchMessages(userId);
    }
  }, [searchParams]);

  // Listen to incoming socket messages instantly (no polling)
  useEffect(() => {
    if (!socket) return;

    // When a message comes in
    const handleReceiveMessage = (msg: Message) => {
      // Refresh the sidebar to show the latest message preview
      fetchChats();

      // If we are currently chatting with the sender, append it
      if (activeChat === msg.senderId) {
        setActiveMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [socket, activeChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMsg.trim() || !activeChat) return;

    // Plan restriction: Free users cannot send messages
    if (currentUser.planName === 'Free Registration' || !currentUser.planName) {
      toast.error("Veuillez passer à un forfait payant pour envoyer des messages.", {
        action: {
          label: "Voir les Forfaits",
          onClick: () => navigate("/plans")
        },
      });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          receiverId: activeChat,
          text: newMsg
        })
      });

      const data = await res.json();
      if (data.success) {
        // Optimistically add to UI
        setActiveMessages(prev => [...prev, data.message]);
        setNewMsg("");
        fetchChats(); // Update sidebar immediately

        // Also emit over socket for real-time delivery to the other person
        if (socket) {
          socket.emit("sendMessage", {
            receiverId: activeChat,
            message: data.message
          });
        }
      } else {
        toast.error("Échec de l'envoi du message.");
      }
    } catch (err) {
      toast.error("Erreur serveur lors de l'envoi.");
    }
  };

  // If a chat is active, find its sidebar data to show header info
  const activeChatData = chats.find((c) => c.userId === activeChat);
  const fallbackData = location.state ? {
    userName: location.state.userName,
    userPhoto: location.state.userPhoto,
    userLocation: location.state.userLocation,
  } : null;
  const displayChatData = activeChatData || fallbackData;

  // Formatting date for display
  const formatTime = (isoString?: string) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-5xl pb-16 md:pt-16">
      {/* Chat list Sidebar */}
      <div className={`w-full border-r border-border md:w-80 flex flex-col ${activeChat ? "hidden md:flex" : "flex"}`}>
        <div className="border-b border-border p-4">
          <h1 className="text-xl font-bold text-foreground">Messages</h1>
        </div>

        {chats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center px-6">
            <p className="text-sm text-muted-foreground">Aucune conversation. Likez un profil et envoyez le premier message !</p>
          </div>
        ) : (
          <div className="divide-y divide-border overflow-y-auto flex-1">
            {chats.map((chat) => (
              <button
                key={chat.userId}
                onClick={() => {
                  setActiveChat(chat.userId);
                  fetchMessages(chat.userId);
                }}
                className={`flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted ${activeChat === chat.userId ? "bg-muted" : ""}`}
              >
                <div className="relative">
                  <img src={chat.userPhoto || "https://ui-avatars.com/api/?name=User&background=random"} alt={chat.userName} className="h-12 w-12 rounded-full object-cover" />
                  {onlineUsers.includes(chat.userId) && (
                    <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-background"></span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{chat.userName}</p>
                  <p className="truncate text-sm text-muted-foreground">{chat.lastMessage}</p>
                </div>
                {chat.lastMessageTime && <span className="text-xs text-muted-foreground">{formatTime(chat.lastMessageTime)}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Chat Area */}
      <div className={`flex flex-1 flex-col ${activeChat ? "flex" : "hidden md:flex"}`}>
        {activeChat ? (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 border-b border-border p-4 bg-card z-10">
              <button onClick={() => setActiveChat(null)} className="text-muted-foreground md:hidden">
                <ArrowLeft className="h-5 w-5" />
              </button>
              {displayChatData ? (
                <>
                  <div className="relative">
                    <img src={displayChatData.userPhoto || "https://ui-avatars.com/api/?name=User"} alt={displayChatData.userName || "Utilisateur"} className="h-10 w-10 rounded-full object-cover" />
                    {onlineUsers.includes(activeChat as string) && (
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 ring-2 ring-background"></span>
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground">{displayChatData.userName || "Utilisateur"}</p>
                      {onlineUsers.includes(activeChat as string) && (
                        <span className="text-[10px] font-medium text-green-500 bg-green-500/10 px-1.5 py-0.5 rounded-full">En ligne</span>
                      )}
                    </div>
                    {displayChatData.userLocation && <p className="text-xs text-muted-foreground">{displayChatData.userLocation}</p>}
                  </div>
                </>
              ) : (
                <div className="h-10 flex items-center">
                  <p className="font-semibold text-foreground">Chargement...</p>
                </div>
              )}
            </div>

            {/* Messages body */}
            <div className="flex-1 space-y-4 overflow-y-auto p-4 bg-background">
              {activeMessages.length === 0 && (
                <p className="text-center text-sm text-muted-foreground mt-8">Commencez la conversation ! 👋</p>
              )}
              {activeMessages.map((msg) => {
                const isMe = msg.senderId === currentUserId;
                return (
                  <div key={msg._id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${isMe ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"}`}>
                      {msg.text}
                      <span className={`mt-1 block text-[10px] ${isMe ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {formatTime(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message input form */}
            <div className="border-t border-border p-4 bg-card">
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input value={newMsg} onChange={(e) => setNewMsg(e.target.value)} placeholder="Écrire un message..." className="flex-1" />
                <Button type="submit" size="icon" disabled={!newMsg.trim()}><Send className="h-4 w-4" /></Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground bg-muted/10">
            Sélectionnez une conversation pour commencer à discuter
          </div>
        )}
      </div>
    </div>
  );
}
