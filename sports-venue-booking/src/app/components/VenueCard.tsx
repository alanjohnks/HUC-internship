"use client";

import { bookSlot } from "@/lib/api";
import { useState } from "react";

export default function VenueCard({ venue }: any) {
  const [slots, setSlots] = useState(venue.slots || []);

  const handleBooking = async (slotId: string) => {
    const res = await bookSlot(slotId);

    if (res.error) {
      alert(res.error);
    } else {
      alert("Booked successfully!");

      // ✅ update UI instantly
      setSlots((prev: any[]) =>
        prev.map((slot) =>
          slot.id === slotId ? { ...slot, isBooked: true } : slot
        )
      );
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      {/* Title */}
      <h3
        className="font-bold text-lg truncate"
        title={venue.name}
      >
        {venue.name}
      </h3>

      {/* Info */}
      <p className="text-sm text-gray-500">{venue.sport}</p>
      <p className="font-semibold">₹{venue.price}/hr</p>

      {/* Slots */}
      <div className="mt-4 overflow-x-auto">
        <div className="flex gap-3 min-w-max">
          {slots.length > 0 ? (
            slots.map((slot: any) => (
              <div
                key={slot.id}
                className="w-28 h-20 flex flex-col items-center justify-between bg-gray-100 rounded-lg p-2 flex-shrink-0"
              >
                {/* Time */}
                <span className="text-sm font-medium text-center truncate w-full">
                  {slot.time}
                </span>

                {/* Button */}
                <button
                  onClick={() => handleBooking(slot.id)}
                  disabled={slot.isBooked}
                  className={`w-full text-xs py-1 rounded ${
                    slot.isBooked
                      ? "bg-gray-400 text-white cursor-not-allowed"
                      : "bg-orange-500 text-white hover:bg-orange-600"
                  }`}
                >
                  {slot.isBooked ? "Booked" : "Book"}
                </button>
              </div>
            ))
          ) : (
            <p className="text-gray-400">No slots available</p>
          )}
        </div>
      </div>
    </div>
  );
}