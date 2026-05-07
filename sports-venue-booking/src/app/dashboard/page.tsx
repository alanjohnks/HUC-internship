"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import VenueCard from "../components/VenueCard";
import Profile from "../components/Profile";
import MatchTable from "../components/MatchTable";

import { fetchVenues, fetchOwnerMatches, fetchExploreMatches } from "@/lib/api";
import ChatSidebar from "../components/ChatSidebar";
import ChatWindow from "../components/ChatWindow";
import NotificationFeed from "../components/NotificationFeed";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [venues, setVenues] = useState<any[]>([]);
  const [matches, setMatches] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);

  const [selectedChat, setSelectedChat] = useState<any>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState("dashboard");

  const [user, setUser] = useState<any>(null);

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const stored = localStorage.getItem("user");

        if (stored) {
          setUser(JSON.parse(stored));
        }

        if (activeTab === "explore") {
          const data = await fetchVenues();
          setVenues(data);
        }

        if (activeTab === "dashboard") {
          const data = await fetchOwnerMatches();
          setMatches(data);
        }

        if (activeTab === "matches") {
          const data = await fetchExploreMatches();
          setMatches(data);
        }
        if (activeTab === "chats") {
          const token = localStorage.getItem("token");

          const res = await fetch("/api/chat/my-chats", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          setChats(data || []);

          if (data?.length > 0) {
            setSelectedChat(data[0]);
          }
        }
        if (activeTab === "notifications") {
          const token = localStorage.getItem("token");

          const res = await fetch("/api/notifications", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await res.json();

          setNotifications(data || []);
        }
      } catch (err: any) {
        console.error(err);

        if (err.message === "Unauthorized") {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="ml-64">
        <div className="p-8 space-y-10">
          <h1 className="text-4xl font-bold">Welcome {user?.name || "User"}</h1>

          {/* DASHBOARD */}
          {activeTab === "dashboard" && (
            <section>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-sm text-gray-400">Total Matches</p>

                  <p className="text-2xl font-bold">{matches.length}</p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-sm text-gray-400">Open Matches</p>

                  <p className="text-2xl font-bold text-green-600">
                    {matches.filter((m) => m.status === "OPEN").length}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-sm text-gray-400">Full Matches</p>

                  <p className="text-2xl font-bold text-orange-600">
                    {matches.filter((m) => m.status === "FULL").length}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow">
                  <p className="text-sm text-gray-400">Followers</p>

                  <p className="text-2xl font-bold text-blue-600">
                    {user?.followersCount || 0}
                  </p>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow mb-6 flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold">Create a new match</h3>

                  <p className="text-sm text-gray-500">
                    Public or private booking
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("explore")}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg"
                >
                  Explore Venues
                </button>
              </div>

              <section>
                <div className="flex justify-between mb-4">
                  <h2 className="text-2xl font-bold">Recent Matches</h2>
                </div>

                {loading ? (
                  <div className="h-32 bg-gray-200 animate-pulse rounded-xl" />
                ) : matches.length === 0 ? (
                  <div className="bg-white p-6 rounded-xl text-center">
                    No matches yet
                  </div>
                ) : (
                  <MatchTable data={matches.slice(0, 5)} currentUser={user} />
                )}
              </section>
            </section>
          )}

          {/* EXPLORE */}
          {activeTab === "explore" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">All Venues</h2>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="h-40 bg-gray-200 animate-pulse rounded-xl"
                    />
                  ))}
                </div>
              ) : venues.length === 0 ? (
                <p>No venues available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {venues.map((venue) => (
                    <VenueCard key={venue.id} venue={venue} />
                  ))}
                </div>
              )}
            </section>
          )}

          {/* PUBLIC MATCHES */}
          {activeTab === "matches" && (
            <section>
              <div className="flex justify-between mb-6">
                <h2 className="text-2xl font-bold">Explore Public Matches</h2>
              </div>

              {loading ? (
                <div className="h-32 bg-gray-200 animate-pulse rounded-xl" />
              ) : (
                <MatchTable data={matches} currentUser={user}/>
              )}
            </section>
          )}
          {activeTab === "chats" && (
            <section className="h-[85vh]  rounded-2xl border border-gray-200 bg-white">
              <div className="flex h-full">
                <ChatSidebar
                  chats={chats}
                  selectedChat={selectedChat}
                  setSelectedChat={setSelectedChat}
                />

                <ChatWindow selectedChat={selectedChat} currentUser={user} />
              </div>
            </section>
          )}
          {activeTab === "notifications" && (
            <section>
              <NotificationFeed notifications={notifications} />
            </section>
          )}
          {/* PROFILE */}
          {activeTab === "profile" && (
            <section>
              <Profile user={user} matches={matches} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
