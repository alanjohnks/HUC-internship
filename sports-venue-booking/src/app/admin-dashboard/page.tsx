"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import AdminSidebar from "../components/AdminSidebar";

import PendingVenues from "../components/PendingVenues";

import AdminBookings from "../components/AdminBookings";

export default function AdminDashboard() {
  const router = useRouter();

  const [active, setActive] =
    useState("dashboard");

  const [user, setUser] =
    useState<any>(null);

  const [pendingCount, setPendingCount] =
    useState(0);

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const fetchPendingCount =
      async () => {
        try {
          const token =
            localStorage.getItem("token");

          const res = await fetch(
            "/api/admin/pending-venues",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const data = await res.json();

          if (Array.isArray(data)) {
            setPendingCount(
              data.length
            );
          }
        } catch (error) {
          console.error(error);
        }
      };

    fetchPendingCount();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");

    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar
        active={active}
        setActive={setActive}
      />

      <main className="ml-64 p-8 space-y-8">
        {active === "dashboard" && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  Admin Dashboard
                </h1>

                <p className="text-gray-500 mt-1">
                  Manage venues,
                  bookings and
                  platform activity
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl border border-gray-100 shadow-sm">
                  <div className="w-11 h-11 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg">
                    {user?.name?.charAt(
                      0
                    )}
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      {user?.name}
                    </p>

                    <p className="text-xs text-gray-500">
                      Administrator
                    </p>
                  </div>
                </div>

                <button
                  onClick={
                    handleLogout
                  }
                  className="bg-red-500 text-white px-5 py-3 rounded-xl hover:bg-red-600 transition font-medium"
                >
                  Logout
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-400">
                  Platform Status
                </p>

                <p className="text-2xl font-bold text-green-600 mt-2">
                  Active
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-400">
                  Venue Approval
                </p>

                <p className="text-2xl font-bold mt-2">
                  {pendingCount}
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-400">
                  Match System
                </p>

                <p className="text-2xl font-bold text-orange-500 mt-2">
                  Live
                </p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <p className="text-sm text-gray-400">
                  Chat System
                </p>

                <p className="text-2xl font-bold text-blue-500 mt-2">
                  Enabled
                </p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-800">
                Welcome Admin 👨‍💻
              </h2>

              <p className="text-gray-500 mt-3 leading-relaxed">
                Review pending
                venues, monitor
                bookings and oversee
                public/private sports
                matches across the
                platform.
              </p>
            </div>
          </section>
        )}

        {active === "pending" && (
          <PendingVenues />
        )}

        {active === "bookings" && (
          <AdminBookings />
        )}
      </main>
    </div>
  );
}