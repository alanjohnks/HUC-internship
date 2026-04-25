"use client";

import { useEffect, useState } from "react";
import OwnerSidebar from "../components/OwnerSidebar";
import AddVenue from "../components/AddVenue";
import MyVenues from "../components/MyVenues";
import OwnerBookings from "../components/OwnerBookings";

export default function OwnerDashboard() {
  const [active, setActive] = useState("dashboard");

  const [venues, setVenues] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔥 Fetch Owner Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [vRes, bRes] = await Promise.all([
          fetch("/api/owners/venue", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/owners/bookings", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const vData = await vRes.json();
        const bData = await bRes.json();

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

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <OwnerSidebar active={active} setActive={setActive} />

      <main className="ml-64 p-8 space-y-8">
        
        {/* 🔷 DASHBOARD */}
        {active === "dashboard" && (
          <section className="space-y-6">
            
            <h1 className="text-3xl font-bold">
              Welcome back 👋
            </h1>

            {/* 🔥 Loading */}
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="h-24 bg-gray-200 animate-pulse rounded-xl" />
                <div className="h-24 bg-gray-200 animate-pulse rounded-xl" />
                <div className="h-24 bg-gray-200 animate-pulse rounded-xl" />
                <div className="h-24 bg-gray-200 animate-pulse rounded-xl" />
              </div>
            ) : (
              <>
                {/* 🔷 Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                  <div className="bg-white p-4 rounded-xl shadow border">
                    <p className="text-sm text-gray-400">Total Venues</p>
                    <p className="text-2xl font-bold">{venues.length}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow border">
                    <p className="text-sm text-gray-400">Total Bookings</p>
                    <p className="text-2xl font-bold">{bookings.length}</p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow border">
                    <p className="text-sm text-gray-400">Revenue</p>
                    <p className="text-2xl font-bold text-green-600">
                      ₹
                      {bookings.reduce(
                        (sum: number, b: any) =>
                          sum + (b.slot?.venue?.price || 0),
                        0
                      )}
                    </p>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow border">
                    <p className="text-sm text-gray-400">Active Venues</p>
                    <p className="text-2xl font-bold">
                      {venues.filter((v: any) => v.approved).length}
                    </p>
                  </div>
                </div>

                {/* 🔥 Quick Action */}
                <div className="bg-white p-6 rounded-xl shadow border flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold">
                      Add a new venue
                    </h3>
                    <p className="text-sm text-gray-500">
                      Start earning by listing your venue
                    </p>
                  </div>

                  <button
                    onClick={() => setActive("add")}
                    className="bg-orange-500 text-white px-5 py-2 rounded-lg hover:bg-orange-600"
                  >
                    Add Venue
                  </button>
                </div>

                {/* 🔷 Recent Bookings */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    Recent Bookings
                  </h2>

                  {bookings.length === 0 ? (
                    <p className="text-gray-500">
                      No bookings yet
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {bookings.slice(0, 3).map((b: any) => (
                        <div
                          key={b.id}
                          className="bg-white p-4 rounded-xl shadow border flex justify-between"
                        >
                          <div>
                            <p className="font-semibold">
                              {b.slot?.venue?.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              {b.user?.email}
                            </p>
                          </div>

                          <div className="text-right">
                            <p className="text-sm">
                              {b.slot?.time}
                            </p>
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Confirmed
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 🔷 Venue Preview */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">
                    My Venues
                  </h2>

                  {venues.length === 0 ? (
                    <p className="text-gray-500">
                      No venues yet
                    </p>
                  ) : (
                    <div className="grid md:grid-cols-3 gap-4">
                      {venues.slice(0, 3).map((v: any) => (
                        <div
                          key={v.id}
                          className="bg-white p-4 rounded-xl shadow border"
                        >
                          <p className="font-semibold">
                            {v.name}
                          </p>
                          <p className="text-sm text-gray-500">
                            {v.location}
                          </p>
                          <p className="text-orange-600 font-bold">
                            ₹{v.price}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        )}

        {/* 🔷 ADD VENUE */}
        {active === "add" && <AddVenue />}

        {/* 🔷 MY VENUES */}
        {active === "venues" && <MyVenues />}

        {/* 🔷 BOOKINGS */}
        {active === "bookings" && <OwnerBookings />}
      </main>
    </div>
  );
}