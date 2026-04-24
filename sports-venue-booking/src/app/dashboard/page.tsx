"use client";

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import VenueCard from "../components/VenueCard";
import BookingTable from "../components/BookingTable";
import { fetchVenues, fetchBookings } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const [venues, setVenues] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [user, setUser] = useState<any>(null);

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
          <h1 className="text-4xl font-bold">
            Welcome {user?.name || "User"}
          </h1>

          {/* ================= DASHBOARD ================= */}
          {activeTab === "dashboard" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">
                My Recent Bookings
              </h2>

              {loading ? (
                <div className="h-32 bg-gray-200 animate-pulse rounded-xl" />
              ) : bookings.length === 0 ? (
                <p className="text-gray-500">No bookings yet</p>
              ) : (
                <BookingTable data={bookings} />
              )}
            </section>
          )}

          {/* ================= EXPLORE ================= */}
          {activeTab === "explore" && (
            <section>
              <h2 className="text-2xl font-bold mb-4">
                All Venues
              </h2>

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
        </div>
      </main>
    </div>
  );
}