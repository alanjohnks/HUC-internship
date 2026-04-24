"use client";

import { bookSlot } from "@/lib/api";
import router from "next/router";

export default function VenueCard({ venue }: any) {
  const handleBooking = async (slotId: string) => {
  const token = localStorage.getItem("token");

  const res = await bookSlot(slotId, token!);

  if (res.error) {
    alert(res.error); // "Slot already booked"
  } else {
    alert("Booked successfully!");
    router.refresh();
  }
};


  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h3 className="font-bold text-lg">{venue.name}</h3>
      <p className="text-sm text-gray-500">{venue.sport}</p>
      <p className="font-semibold">₹{venue.price}/hr</p>

      <div className="mt-4 space-y-2">
        {venue.slots?.length > 0 ? (
          venue.slots.map((slot: any) => (
            <div
              key={slot.id}
              className="flex justify-between items-center"
            >
              <span>{slot.time}</span>

              <button
                onClick={() => handleBooking(slot.id)}
                disabled={slot.isBooked}
                className={`px-3 py-1 rounded ${
                  slot.isBooked
                    ? "bg-gray-400"
                    : "bg-orange-500 text-white"
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
  );
}
