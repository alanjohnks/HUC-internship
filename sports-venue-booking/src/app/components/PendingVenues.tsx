"use client";

import { useEffect, useState } from "react";

export default function PendingVenues() {
  const [venues, setVenues] = useState<any[]>([]);

  const fetchVenues = async () => {
    const res = await fetch("/api/admin/pending-venues", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const data = await res.json();
    setVenues(data);
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  const approveVenue = async (id: string) => {
    await fetch("/api/admin/approve", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({ venueId: id }),
    });

    // refresh list
    setVenues((prev) => prev.filter((v) => v.id !== id));
  };

  return (
    <div className="space-y-4">
      {venues.length === 0 ? (
        <p>No pending venues</p>
      ) : (
        venues.map((v) => (
          <div key={v.id} className="border p-4 rounded-lg">
            <h3 className="font-bold">{v.name}</h3>
            <p>{v.sport}</p>
            <p>₹{v.price}</p>

            <button
              onClick={() => approveVenue(v.id)}
              className="mt-2 bg-green-500 text-white px-3 py-1 rounded"
            >
              Approve
            </button>
          </div>
        ))
      )}
    </div>
  );
}