"use client";

import { useEffect, useState } from "react";

export default function OwnerBookings() {
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await fetch("/api/bookings/owner", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setBookings(data);
    };

    fetchBookings();
  }, []);

  return (
    <div className="space-y-4">
      {bookings.length === 0 ? (
        <p>No bookings yet</p>
      ) : (
        bookings.map((b) => (
          <div key={b.id} className="border p-4 rounded-lg">
            <p><strong>User:</strong> {b.user?.email}</p>
            <p><strong>Venue:</strong> {b.slot?.venue?.name}</p>
            <p><strong>Time:</strong> {b.slot?.time}</p>
          </div>
        ))
      )}
    </div>
  );
}