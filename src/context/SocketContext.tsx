import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { toast } from "sonner";
import { useLocation } from "react-router-dom";

interface SocketContextType {
    socket: Socket | null;
    onlineUsers: string[];
}

const SocketContext = createContext<SocketContextType>({ socket: null, onlineUsers: [] });

export const useSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
    const location = useLocation();

    useEffect(() => {
        const rawUser = localStorage.getItem("user");
        if (!rawUser) return;

        const user = JSON.parse(rawUser);
        const userId = user.id || user._id;
        if (!userId) return;

        // Connect to server
        const socketUrl = import.meta.env.PROD ? "https://amour-et-sincerite.com" : "http://localhost:5000";
        const newSocket = io(socketUrl);
        setSocket(newSocket);

        newSocket.on("connect", () => {
            newSocket.emit("register", userId);
        });

        newSocket.on("online_users", (users: string[]) => {
            setOnlineUsers(users);
        });

        // We can't use location hook easily inside this effect cleanly without re-running socket connection
        // So we just attach a listener. However, `Messages.tsx` might also be listening.
        // If the user is on the messages page AND active on that specific chat, we might not want to toast.

        newSocket.on("receiveMessage", (msg: any) => {
            // Check if we are currently looking at the chat
            const isChatOpen = window.location.pathname === "/messages" && window.location.search.includes(`user=${msg.senderId}`);

            if (!isChatOpen) {
                toast("Nouveau message", {
                    description: msg.text,
                    action: {
                        label: "Voir",
                        onClick: () => window.location.href = `/messages?user=${msg.senderId}`,
                    },
                });
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, onlineUsers }}>
            {children}
        </SocketContext.Provider>
    );
};
