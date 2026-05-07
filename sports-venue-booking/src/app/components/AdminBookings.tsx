"use client";

import { useEffect, useState } from "react";

export default function AdminBookings() {
  const [bookings, setBookings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const res = await fetch(
          "/api/admin/bookings",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          console.error(data.error);

          setBookings([]);

          return;
        }

        setBookings(
          Array.isArray(data)
            ? data
            : []
        );
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Match Bookings
        </h2>

        <p className="text-gray-500 mt-2">
          Monitor all public/private
          match participants
        </p>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="h-28 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-28 bg-gray-200 animate-pulse rounded-2xl" />
          <div className="h-28 bg-gray-200 animate-pulse rounded-2xl" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-12 text-center">
          <h3 className="text-2xl font-bold text-gray-700">
            No Bookings Found
          </h3>

          <p className="text-gray-500 mt-3">
            No match participants yet
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xl">
                    {booking.user?.name?.charAt(
                      0
                    ) || "U"}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {
                        booking.user
                          ?.name
                      }
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {
                        booking.user
                          ?.email
                      }
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-5 gap-5 flex-1">
                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Match
                    </p>

                    <p className="font-semibold text-gray-800 mt-1">
                      {
                        booking.match
                          ?.title
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Venue
                    </p>

                    <p className="font-semibold text-gray-800 mt-1">
                      {
                        booking.match
                          ?.venue
                          ?.name
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Location
                    </p>

                    <p className="font-semibold text-gray-800 mt-1">
                      {
                        booking.match
                          ?.venue
                          ?.location
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Amount Paid
                    </p>

                    <p className="font-bold text-green-600 mt-1">
                      ₹
                      {
                        booking.amountPaid
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      Match Type
                    </p>

                    <span
                      className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${
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

                <div className="flex items-center">
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      booking.paymentStatus ===
                      "PAID"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {
                      booking.paymentStatus
                    }
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}