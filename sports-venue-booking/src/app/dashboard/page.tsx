"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import VenueCard from "../components/VenueCard";
import Profile from "../components/Profile";
import BookingTable from "../components/BookingTable";
import { fetchVenues, fetchBookings } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [venues, setVenues] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<any>(null);
  const [showProfile, setShowProfile] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true); // ✅ important

        // 🔁 Fetch based on tab
        if (activeTab === "explore") {
          const v = await fetchVenues();
          setVenues(v);
        }

        if (activeTab === "dashboard") {
          const b = await fetchBookings();
          setBookings(b);
        }

        // 👤 Load user from localStorage
        const stored = localStorage.getItem("user");
        if (stored) {
          setUser(JSON.parse(stored));
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
  }, [activeTab]); // ✅ key fix

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="ml-64">
        <div className="p-8 space-y-10">
          {/* HEADER */}
          <h1 className="text-4xl font-bold">Welcome {user?.name || "User"}</h1>

          {/* ================= DASHBOARD ================= */}
          {activeTab === "dashboard" && (
            <section>
              {/* 🔷 Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                  <p className="text-sm text-gray-400">Total Bookings</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {bookings.length}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                  <p className="text-sm text-gray-400">Upcoming</p>
                  <p className="text-2xl font-bold text-green-600">
                    {bookings.filter((b: any) => !b.completed).length}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                  <p className="text-sm text-gray-400">Completed</p>
                  <p className="text-2xl font-bold text-gray-600">
                    {bookings.filter((b: any) => b.completed).length}
                  </p>
                </div>

                <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
                  <p className="text-sm text-gray-400">Role</p>
                  <p className="text-lg font-semibold text-orange-600">
                    {user?.role}
                  </p>
                </div>
              </div>

              {/* 🔥 Quick Action */}
              <div className="bg-white p-6 rounded-xl shadow border border-gray-100 mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Ready to play?
                  </h3>
                  <p className="text-sm text-gray-500">
                    Book your next slot in seconds
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab("explore")}
                  className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition"
                >
                  Explore Venues
                </button>
              </div>

              {/* 🔷 Recent Bookings */}
              <section>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Recent Bookings
                  </h2>

                  <button
                    onClick={() => setActiveTab("explore")}
                    className="text-sm text-orange-600 hover:underline"
                  >
                    Book more →
                  </button>
                </div>

                {loading ? (
                  <div className="h-32 bg-gray-200 animate-pulse rounded-xl" />
                ) : bookings.length === 0 ? (
                  <div className="bg-white p-6 rounded-xl text-center text-gray-500 shadow border border-gray-100">
                    No bookings yet. Start exploring venues!
                  </div>
                ) : (
                  <BookingTable data={bookings.slice(0, 5)} />
                )}
              </section>
            </section>
          )}

          {/* ================= EXPLORE ================= */}
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
                <p className="text-gray-500">No venues available</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                  {venues.map((v) => (
                    <VenueCard key={v.id} venue={v} />
                  ))}
                </div>
              )}
            </section>
          )}
          {/* ================= PROFILE ================= */}
          {activeTab === "profile" && (
            <section>
              <Profile user={user} bookings={bookings} />
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
