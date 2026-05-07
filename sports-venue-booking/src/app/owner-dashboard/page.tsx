"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import OwnerSidebar from "../components/OwnerSidebar";
import AddVenue from "../components/AddVenue";
import MyVenues from "../components/MyVenues";
import OwnerBookings from "../components/OwnerBookings";

export default function OwnerDashboard() {
  const router = useRouter();

  const [active, setActive] =
    useState("dashboard");

  const [venues, setVenues] =
    useState<any[]>([]);

  const [bookings, setBookings] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [user, setUser] =
    useState<any>(null);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchData = async () => {
      try {
        const token =
          localStorage.getItem("token");

        const [vRes, bRes] =
          await Promise.all([
            fetch("/api/owners/venue", {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }),

            fetch(
              "/api/owners/bookings",
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ),
          ]);

        const vData =
          await vRes.json();

        const bData =
          await bRes.json();

        setVenues(vData || []);

        setBookings(bData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <OwnerSidebar
        active={active}
        setActive={setActive}
      />

      <main className="ml-64 p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Owner Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Manage venues, matches and
              bookings
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                {user?.name?.charAt(0)}
              </div>

              <div>
                <p className="font-semibold text-gray-800">
                  {user?.name}
                </p>

                <p className="text-xs text-gray-500">
                  Venue Owner
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600 transition font-medium"
            >
              Logout
            </button>
          </div>
        </div>

        {active === "dashboard" && (
          <section className="space-y-6">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="h-24 bg-gray-200 animate-pulse rounded-xl" />
                <div className="h-24 bg-gray-200 animate-pulse rounded-xl" />
                <div className="h-24 bg-gray-200 animate-pulse rounded-xl" />
                <div className="h-24 bg-gray-200 animate-pulse rounded-xl" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-2xl shadow border border-gray-100">
                    <p className="text-sm text-gray-400">
                      Total Venues
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      {venues.length}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow border border-gray-100">
                    <p className="text-sm text-gray-400">
                      Total Bookings
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      {bookings.length}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow border border-gray-100">
                    <p className="text-sm text-gray-400">
                      Revenue
                    </p>

                    <p className="text-3xl font-bold text-green-600 mt-2">
                      ₹
                      {bookings.reduce(
                        (
                          sum: number,
                          b: any
                        ) =>
                          sum +
                          (b.slot?.venue
                            ?.price || 0),
                        0
                      )}
                    </p>
                  </div>

                  <div className="bg-white p-5 rounded-2xl shadow border border-gray-100">
                    <p className="text-sm text-gray-400">
                      Active Venues
                    </p>

                    <p className="text-3xl font-bold mt-2">
                      {
                        venues.filter(
                          (v: any) =>
                            v.approved
                        ).length
                      }
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl shadow border border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Add a new venue
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      Start hosting public
                      and private matches
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      setActive("add")
                    }
                    className="bg-orange-500 text-white px-6 py-3 rounded-xl hover:bg-orange-600 transition"
                  >
                    Add Venue
                  </button>
                </div>

                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Recent Bookings
                  </h2>

                  {bookings.length ===
                  0 ? (
                    <p className="text-gray-500">
                      No bookings yet
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {bookings
                        .slice(0, 3)
                        .map((b: any) => (
                          <div
                            key={b.id}
                            className="bg-white p-5 rounded-2xl shadow border border-gray-100 flex justify-between"
                          >
                            <div>
                              <p className="font-semibold text-gray-800">
                                {
                                  b.slot?.venue
                                    ?.name
                                }
                              </p>

                              <p className="text-sm text-gray-500 mt-1">
                                {
                                  b.user
                                    ?.email
                                }
                              </p>
                            </div>

                            <div className="text-right">
                              <p className="text-sm text-gray-700">
                                {
                                  b.slot
                                    ?.time
                                }
                              </p>

                              <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                                Confirmed
                              </span>
                            </div>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        )}

        {active === "add" && (
          <AddVenue />
        )}

        {active === "venues" && (
          <MyVenues />
        )}

        {active === "bookings" && (
          <OwnerBookings />
        )}
      </main>
    </div>
  );
}