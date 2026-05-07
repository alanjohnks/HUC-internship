"use client";

import { useEffect, useState } from "react";

export default function OwnerBookings() {
  const [bookings, setBookings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch(
          "/api/owners/bookings",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(
                "token"
              )}`,
            },
          }
        );

        const data =
          await res.json();

        setBookings(
          Array.isArray(data)
            ? data
            : []
        );
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
      <h2 className="text-2xl font-bold mb-6">
        Venue Bookings
      </h2>

      <div className="bg-white p-5 rounded-2xl shadow border border-gray-100 mb-6">
        <p className="text-sm text-gray-400">
          Total Bookings
        </p>

        <p className="text-3xl font-bold text-gray-800 mt-1">
          {bookings.length}
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-24 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-24 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-24 bg-gray-200 animate-pulse rounded-2xl" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl text-center text-gray-500 shadow border border-gray-100">
          No bookings yet
        </div>
      ) : (
        <div className="space-y-5 max-h-[650px] overflow-y-auto pr-2">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-lg transition flex items-center justify-between"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold">
                  {booking.user?.name
                    ?.charAt(0)
                    ?.toUpperCase()}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {
                      booking.match
                        ?.venue?.name
                    }
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    {
                      booking.user
                        ?.email
                    }
                  </p>

                  <p className="text-sm text-gray-400 mt-1">
                    {
                      booking.match
                        ?.venue
                        ?.location
                    }
                  </p>

                  <div className="flex items-center gap-2 mt-3">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-600">
                      {
                        booking.match
                          ?.sport
                      }
                    </span>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        booking.match
                          ?.visibility ===
                        "PUBLIC"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {
                        booking.match
                          ?.visibility
                      }
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <p className="text-2xl font-bold text-green-600">
                  ₹
                  {booking.amountPaid?.toFixed(
                    2
                  )}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Split Amount
                </p>

                <span className="inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  {
                    booking.paymentStatus
                  }
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}