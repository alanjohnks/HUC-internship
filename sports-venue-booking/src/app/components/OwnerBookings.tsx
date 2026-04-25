"use client";

import { useEffect, useState } from "react";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/owners/bookings", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <section>
      {/* 🔷 Header */}
      <h2 className="text-2xl font-bold mb-6">
        Venue Bookings
      </h2>

      {/* 🔥 Stats */}
      <div className="bg-white p-4 rounded-xl shadow border border-gray-100 mb-6">
        <p className="text-sm text-gray-400">Total Bookings</p>
        <p className="text-2xl font-bold text-gray-800">
          {bookings.length}
        </p>
      </div>

      {/* 🔷 Content */}
      {loading ? (
        <div className="space-y-3">
          <div className="h-20 bg-gray-200 animate-pulse rounded-xl" />
          <div className="h-20 bg-gray-200 animate-pulse rounded-xl" />
          <div className="h-20 bg-gray-200 animate-pulse rounded-xl" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-6 rounded-xl text-center text-gray-500 shadow border border-gray-100">
          No bookings yet
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow hover:shadow-md transition flex justify-between items-center"
            >
              
              {/* Left */}
              <div className="flex items-center gap-4">
                
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold">
                  {b.user?.email?.charAt(0)?.toUpperCase()}
                </div>

                {/* Info */}
                <div>
                  <p className="font-semibold text-gray-800">
                    {b.slot?.venue?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {b.user?.email}
                  </p>
                </div>
              </div>

              {/* Right */}
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700">
                  {b.slot?.time}
                </p>

                <span className="inline-block mt-1 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                  Confirmed
                </span>
              </div>
            </div>
          ))}

        </div>
      )}
    </section>
  );
}