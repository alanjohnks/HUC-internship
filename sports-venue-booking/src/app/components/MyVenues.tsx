"use client";

import { useEffect, useState } from "react";

export default function MyVenues() {
  const [venues, setVenues] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/venues");
      const data = await res.json();
      setVenues(data);
    };

    fetchData();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {venues.map((v) => (
        <div key={v.id} className="border p-4 rounded-lg shadow">
          <h3 className="font-bold">{v.name}</h3>
          <p>{v.sport}</p>
          <p>₹{v.price}</p>
          <p className="text-sm text-gray-500">{v.location}</p>

          <div className="mt-2 text-sm text-gray-600">
            Slots: {v.slots?.length || 0}
          </div>

          {/* Future buttons */}
          <div className="flex gap-2 mt-3">
            <button className="text-blue-500">Edit</button>
            <button className="text-red-500">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}