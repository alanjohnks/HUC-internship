"use client";

interface ChatSidebarProps {
  chats: any[];
  selectedChat: any;
  setSelectedChat: (chat: any) => void;
}

export default function ChatSidebar({
  chats,
  selectedChat,
  setSelectedChat,
}: ChatSidebarProps) {
  return (
    <div className="w-[350px] border-r border-gray-200 bg-white h-screen overflow-y-auto">
      <div className="p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
        <h2 className="text-2xl font-bold text-gray-800">
          Chats
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Active match conversations
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {chats.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
            className={`w-full p-4 text-left transition hover:bg-gray-50 ${
              selectedChat?.id === chat.id
                ? "bg-orange-50"
                : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  chat.match?.venue?.images?.[0] ||
                  "https://placehold.co/100x100"
                }
                alt="venue"
                className="w-14 h-14 rounded-xl object-cover"
              />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {chat.match?.title || "Match Chat"}
                  </h3>

                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {chat.messages?.length || 0}
                  </span>
                </div>

                <p className="text-sm text-gray-500 truncate mt-1">
                  {chat.messages?.[
                    chat.messages.length - 1
                  ]?.content || "No messages yet"}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-600">
                    {chat.match?.sport}
                  </span>

                  <span className="text-xs text-gray-400">
                    {chat.match?.currentPlayers}/
                    {chat.match?.maxPlayers} players
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}

        {chats.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No active chats
          </div>
        )}
      </div>
    </div>
  );
}