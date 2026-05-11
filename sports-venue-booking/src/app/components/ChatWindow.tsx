"use client";

import { useEffect, useRef, useState } from "react";

interface ChatWindowProps {
  selectedChat: any;
  currentUser: any;
}

export default function ChatWindow({
  selectedChat,
  currentUser,
}: ChatWindowProps) {
  const [messages, setMessages] = useState<any[]>(
    []
  );

  const [message, setMessage] = useState("");

  const [selectedProfile, setSelectedProfile] =
    useState<any>(null);

  const [following, setFollowing] =
    useState(false);

  const messagesEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
  if (!selectedChat?.matchId) return;

  const interval = setInterval(async () => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        `/api/chat/${selectedChat.matchId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error(error);
    }
  }, 2000);

  return () => clearInterval(interval);
}, [selectedChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const token = localStorage.getItem("token");

    try {
      const res = await fetch(
        `/api/chat/${selectedChat.matchId}/send`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            content: message,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Failed to send");
        return;
      }

      setMessages((prev) => [...prev, data]);

      setMessage("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFollowToggle = async (
    userId: string
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const endpoint = following
        ? `/api/follow/${userId}`
        : `/api/follow/${userId}`;

      const method = following
        ? "DELETE"
        : "POST";

      const res = await fetch(endpoint, {
        method,

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error || "Something went wrong"
        );
        return;
      }

      setFollowing(!following);
    } catch (error) {
      console.error(error);
    }
  };

  if (!selectedChat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-700">
            Select a chat
          </h2>

          <p className="text-gray-500 mt-2">
            Open a match conversation to start
            chatting
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-5 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src={
              selectedChat.match?.venue?.images?.[0] ||
              "https://placehold.co/100x100"
            }
            alt="venue"
            className="w-14 h-14 rounded-xl object-cover"
          />

          <div>
            <h2 className="text-xl font-bold text-gray-800">
              {selectedChat.match?.title ||
                "Match Chat"}
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              {selectedChat.match?.venue?.name}
            </p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-sm font-medium text-gray-700">
            {selectedChat.match?.currentPlayers}/
            {selectedChat.match?.maxPlayers} Players
          </p>

          <span className="inline-block mt-1 px-3 py-1 rounded-full text-xs bg-green-100 text-green-600">
            {selectedChat.match?.status}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="flex flex-col gap-4 min-h-full justify-end">
          {messages.map((msg) => {
            const isCurrentUser =
              msg.senderId === currentUser?.id;

            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  isCurrentUser
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {!isCurrentUser && (
                  <button
                    onClick={() => {
                      setSelectedProfile(
                        msg.sender
                      );

                      setFollowing(false);
                    }}
                  >
                    {msg.sender
                      ?.profileImage ? (
                      <img
                        src={
                          msg.sender
                            .profileImage
                        }
                        alt="profile"
                        className="w-9 h-9 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold">
                        {msg.sender?.name?.charAt(
                          0
                        )}
                      </div>
                    )}
                  </button>
                )}

                <div
                  className={`max-w-[70%] px-4 py-3 rounded-2xl shadow-sm ${
                    isCurrentUser
                      ? "bg-orange-500 text-white"
                      : "bg-white text-gray-800"
                  }`}
                >
                  {!isCurrentUser && (
                    <p className="text-xs font-semibold mb-1 text-orange-500">
                      {msg.sender?.name}
                    </p>
                  )}

                  <p className="text-sm leading-relaxed">
                    {msg.content}
                  </p>

                  <p
                    className={`text-[10px] mt-2 ${
                      isCurrentUser
                        ? "text-orange-100"
                        : "text-gray-400"
                    }`}
                  >
                    {new Date(
                      msg.createdAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Type a message..."
            value={message}
            onChange={(e) =>
              setMessage(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
          />

          <button
            onClick={handleSendMessage}
            className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition"
          >
            Send
          </button>
        </div>
      </div>

      {selectedProfile && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-3xl p-8 w-[400px] shadow-2xl relative">
            <button
              onClick={() =>
                setSelectedProfile(null)
              }
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              ✕
            </button>

            <div className="flex flex-col items-center text-center">
              {selectedProfile.profileImage ? (
                <img
                  src={
                    selectedProfile.profileImage
                  }
                  alt="profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-orange-500 text-white flex items-center justify-center text-3xl font-bold">
                  {selectedProfile.name?.charAt(
                    0
                  )}
                </div>
              )}

              <h2 className="text-2xl font-bold text-gray-800 mt-5">
                {selectedProfile.name}
              </h2>

              <p className="text-gray-500 mt-2">
                {selectedProfile.email}
              </p>

              {selectedProfile.bio && (
                <p className="text-sm text-gray-600 mt-4">
                  {selectedProfile.bio}
                </p>
              )}

              <button
                onClick={() =>
                  handleFollowToggle(
                    selectedProfile.id
                  )
                }
                className={`mt-6 px-6 py-3 rounded-xl text-white font-medium transition ${
                  following
                    ? "bg-gray-700 hover:bg-black"
                    : "bg-orange-500 hover:bg-orange-600"
                }`}
              >
                {following
                  ? "Unfollow"
                  : "Follow"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}