"use client";

import { useState } from "react";
import OwnerSidebar from "../components/OwnerSidebar";
import AddVenue from "../components/AddVenue";
import MyVenues from "../components/MyVenues";
import OwnerBookings from "../components/OwnerBookings";

export default function OwnerDashboard() {
  const [active, setActive] = useState("dashboard");

  return (
    <div className="text-on-surface min-h-screen">
      <OwnerSidebar active={active} setActive={setActive} />

      <main className="ml-64 p-8 space-y-10">

        {/* DASHBOARD */}
        {active === "dashboard" && (
          <h1 className="text-3xl font-bold">
            Welcome Owner 👋
          </h1>
        )}

        {/* ADD VENUE */}
        {active === "add" && <AddVenue />}

        {/* MY VENUES */}
        {active === "venues" && <MyVenues />}

        {/* BOOKINGS */}
        {active === "bookings" && <OwnerBookings />}

      </main>
    </div>
  );
}