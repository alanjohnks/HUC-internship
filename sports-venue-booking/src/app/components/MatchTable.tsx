"use client";

import { useRouter } from "next/navigation";

interface MatchTableProps {
  data: any[];
  currentUser?: any;
  onJoin?: (matchId: string) => void;
}

export default function MatchTable({
  data,
  currentUser,
  onJoin,
}: MatchTableProps) {
  const router = useRouter();

  const handleJoin = async (matchId: string) => {
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`/api/matches/${matchId}/join`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (!res.ok) {
        alert(result.error || "Failed to join");
        return;
      }

      alert("Joined match successfully");

      if (onJoin) {
        onJoin(matchId);
      }

      router.refresh();
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    }
  };

  return (
    <div className="overflow-hidden bg-white rounded-2xl shadow border border-gray-100">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Match
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Venue
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Visibility
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Players
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Price
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Status
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Date
              </th>

              <th className="text-left px-6 py-4 font-semibold text-gray-600">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {data.map((match) => {
              const isCreator = currentUser?.id === match.creatorId;

              const isJoined = match.participants?.some(
                (p: any) => p.userId === currentUser?.id,
              );

              const isFull = match.currentPlayers >= match.maxPlayers;

              return (
                <tr
                  key={match.id}
                  className="border-b border-gray-100 hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {match.title || "Untitled Match"}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {match.sport}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-700">
                        {match.venue?.name}
                      </p>

                      <p className="text-xs text-gray-500">
                        {match.venue?.location}
                      </p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        match.visibility === "PUBLIC"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {match.visibility}
                    </span>
                  </td>

                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-700">
                      {match.currentPlayers}/{match.maxPlayers}
                    </p>
                  </td>

                  <td className="px-6 py-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        ₹{match.splitPrice}
                      </p>

                      <p className="text-xs text-gray-500">split</p>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        match.status === "OPEN"
                          ? "bg-green-100 text-green-700"
                          : match.status === "FULL"
                            ? "bg-orange-100 text-orange-700"
                            : match.status === "COMPLETED"
                              ? "bg-gray-200 text-gray-700"
                              : "bg-red-100 text-red-700"
                      }`}
                    >
                      {match.status}
                    </span>
                  </td>

                  <td className="px-6 py-4 text-gray-600">
                    {new Date(match.createdAt).toLocaleDateString()}
                  </td>

                  <td className="px-6 py-4">
                    {match.visibility === "PRIVATE" && !isCreator ? (
                      <span className="text-xs text-gray-400">
                        Private Match
                      </span>
                    ) : isCreator ? (
                      <button
                        onClick={() => router.push("/dashboard?tab=chats")}
                        className="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs hover:bg-black"
                      >
                        Manage Match
                      </button>
                    ) : isJoined ? (
                      <span className="text-xs font-medium text-green-600">
                        Joined
                      </span>
                    ) : isFull ? (
                      <button
                        disabled
                        className="bg-gray-200 text-gray-500 px-4 py-2 rounded-lg text-xs cursor-not-allowed"
                      >
                        Full
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoin(match.id)}
                        disabled={match.status === "COMPLETED"}
                        className={`px-4 py-2 rounded-lg text-xs text-white ${
                          match.status === "COMPLETED"
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-orange-500 hover:bg-orange-600"
                        }`}
                      >
                        {match.status === "COMPLETED" ? "Closed" : "Join Match"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <div className="p-10 text-center text-gray-500">No matches found</div>
      )}
    </div>
  );
}
