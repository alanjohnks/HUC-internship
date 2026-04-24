"use client";

import { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import PendingVenues from "../components/PendingVenues";
import AdminBookings from "../components/AdminBookings";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="min-h-screen">
      <AdminSidebar active={active} setActive={setActive} />

      <main className="ml-64 p-8 space-y-10">
        {active === "dashboard" && (
          <h1 className="text-3xl font-bold">Welcome Admin 👨‍💻</h1>
        )}

        {active === "pending" && <PendingVenues />}
        {active === "bookings" && <AdminBookings />}
      </main>
    </div>
  );
}