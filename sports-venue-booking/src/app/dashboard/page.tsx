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
  const router = useRouter();

  useEffect(() => {
  const loadData = async () => {
    try {
      const v = await fetchVenues();

      const b = await fetchBookings();
      console.log(b);

      setVenues(v);
      setBookings(b);
    } catch (err: any) {
      console.error(err);

      // 🔐 If unauthorized → redirect
      if (err.message === "Unauthorized") {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);



  return (
    <div className="bg-surface text-on-surface min-h-screen">
      <Sidebar />

      <main className="ml-64">
        <Topbar />

        <div className="p-8 space-y-10">

          {/* Header */}
          <section>
            <h1 className="text-4xl font-bold">
              Welcome back user1
            </h1>
          </section>

          {/* Venues */}
          <section>
            <h2 className="text-2xl font-bold mb-4">
              Explore Venues
            </h2>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
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

          {/* Bookings */}
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

        </div>
      </main>
    </div>
  );
}
