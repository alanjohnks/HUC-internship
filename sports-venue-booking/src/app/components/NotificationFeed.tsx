"use client";

interface NotificationFeedProps {
  notifications: any[];
}

export default function NotificationFeed({
  notifications,
}: NotificationFeedProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="p-5 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800">
          Notifications
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Follow activity, match joins and updates
        </p>
      </div>

      <div className="divide-y divide-gray-100">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`p-5 transition hover:bg-gray-50 ${
              !notification.isRead
                ? "bg-orange-50"
                : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      notification.type ===
                      "FOLLOW"
                        ? "bg-purple-100 text-purple-600"
                        : notification.type ===
                          "MATCH_CREATED"
                        ? "bg-blue-100 text-blue-600"
                        : notification.type ===
                          "MATCH_JOINED"
                        ? "bg-green-100 text-green-600"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {notification.type}
                  </span>

                  {!notification.isRead && (
                    <span className="w-2 h-2 rounded-full bg-orange-500" />
                  )}
                </div>

                <h3 className="font-semibold text-gray-800 mt-3">
                  {notification.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {notification.message}
                </p>

                <p className="text-xs text-gray-400 mt-3">
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="p-10 text-center text-gray-500">
            No notifications yet
          </div>
        )}
      </div>
    </div>
  );
}