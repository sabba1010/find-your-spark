import { useState, useEffect } from "react";
import { Send, ArrowLeft } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fakeUsers, fakeChats, type Chat } from "@/data/users";

export default function Messages() {
  const [searchParams] = useSearchParams();
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const [chats, setChats] = useState<Chat[]>(fakeChats);
  const [newMsg, setNewMsg] = useState("");

  useEffect(() => {
    const userId = searchParams.get("user");
    if (userId) {
      setActiveChat(userId);
    }
  }, [searchParams]);

  const activeChatData = chats.find((c) => c.userId === activeChat);
  const activeUser = fakeUsers.find((u) => u.id === activeChat);

  const sendMessage = () => {
    if (!newMsg.trim() || !activeChat) return;
    setChats((prev) =>
      prev.map((c) =>
        c.userId === activeChat
          ? {
            ...c,
            messages: [
              ...c.messages,
              { id: `m${Date.now()}`, senderId: "me", text: newMsg, timestamp: "À l'instant" },
            ],
          }
          : c
      )
    );
    setNewMsg("");
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-5xl pb-16 md:pt-16">
      {/* Chat list */}
      <div
        className={`w-full border-r border-border md:w-80 ${activeChat ? "hidden md:block" : ""
          }`}
      >
        <div className="border-b border-border p-4">
          <h1 className="text-xl font-bold text-foreground">Messages</h1>
        </div>
        <div className="divide-y divide-border">
          {chats.map((chat) => {
            const user = fakeUsers.find((u) => u.id === chat.userId)!;
            const lastMsg = chat.messages[chat.messages.length - 1];
            return (
              <button
                key={chat.userId}
                onClick={() => setActiveChat(chat.userId)}
                className={`flex w-full items-center gap-3 p-4 text-left transition-colors hover:bg-muted ${activeChat === chat.userId ? "bg-muted" : ""
                  }`}
              >
                <img
                  src={user.photo}
                  alt={user.name}
                  className="h-12 w-12 rounded-full object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-foreground">{user.name}</p>
                  <p className="truncate text-sm text-muted-foreground">{lastMsg.text}</p>
                </div>
                <span className="text-xs text-muted-foreground">{lastMsg.timestamp}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Chat area */}
      <div
        className={`flex flex-1 flex-col ${activeChat ? "" : "hidden md:flex"
          }`}
      >
        {activeChat && activeUser ? (
          <>
            <div className="flex items-center gap-3 border-b border-border p-4">
              <button
                onClick={() => setActiveChat(null)}
                className="text-muted-foreground md:hidden"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <img
                src={activeUser.photo}
                alt={activeUser.name}
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold text-foreground">{activeUser.name}</p>
                <p className="text-xs text-muted-foreground">{activeUser.location}</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {activeChatData?.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.senderId === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${msg.senderId === "me"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground"
                      }`}
                  >
                    {msg.text}
                    <span className={`mt-1 block text-[10px] ${msg.senderId === "me" ? "text-primary-foreground/60" : "text-muted-foreground"
                      }`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  sendMessage();
                }}
                className="flex gap-2"
              >
                <Input
                  value={newMsg}
                  onChange={(e) => setNewMsg(e.target.value)}
                  placeholder="Écrire un message..."
                  className="flex-1"
                />
                <Button type="submit" size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-muted-foreground">
            Sélectionnez une conversation pour commencer à discuter
          </div>
        )}
      </div>
    </div>
  );
}
