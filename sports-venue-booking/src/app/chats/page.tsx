"use client";

import { useEffect, useState } from "react";

import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";

export default function ChatsPage() {
  const [chats, setChats] = useState<any[]>([]);

  const [selectedChat, setSelectedChat] =
    useState<any>(null);

  const [user, setUser] = useState<any>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadChats = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const res = await fetch(
          "/api/chat/my-chats",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.error || "Failed to load chats"
          );
        }

        setChats(data || []);

        if (data?.length > 0) {
          setSelectedChat(data[0]);
        }

        const storedUser =
          localStorage.getItem("user");

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadChats();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg font-medium text-gray-500">
          Loading chats...
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen  bg-gray-50">
      <ChatSidebar
        chats={chats}
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
      />

      <ChatWindow
        selectedChat={selectedChat}
        currentUser={user}
      />
    </div>
  );
}