"use client";

import { bookSlot } from "@/lib/api";
import { useState } from "react";

export default function VenueCard({ venue }: any) {
  const [slots, setSlots] = useState(venue.slots || []);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const [imgIndex, setImgIndex] = useState(0);

  const images = venue.images?.length
    ? venue.images
    : ["/placeholder.jpg"];

  const handleBooking = async (slotId: string) => {
    setLoadingId(slotId);

    const res = await bookSlot(slotId);

    if (!res.error) {
      setSlots((prev: any[]) =>
        prev.map((slot) =>
          slot.id === slotId ? { ...slot, isBooked: true } : slot
        )
      );
    }

    setLoadingId(null);
  };

  const nextImage = () => {
    setImgIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setImgIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <>
      {/* 🔷 CARD */}
      <div
        onClick={() => setOpenModal(true)}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 cursor-pointer"
      >
        {/* Single Image */}
        <div className="h-48 w-full">
          <img
            src={images[0]}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="font-semibold text-lg text-gray-800 truncate">
            {venue.name}
          </h3>

          <p className="text-sm text-gray-400">{venue.sport}</p>

          <p className="text-xl font-bold text-orange-600 mt-2">
            ₹{venue.price}
            <span className="text-sm text-gray-400"> /hr</span>
          </p>
        </div>
      </div>

      {/* 🔥 MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          
          <div className="bg-white w-[90%] max-w-3xl rounded-2xl overflow-hidden shadow-xl relative">
            
            {/* Close */}
            <button
              onClick={() => setOpenModal(false)}
              className="absolute top-3 right-3 bg-white px-3 py-1 rounded-full shadow z-10"
            >
              ✕
            </button>

            {/* Image Carousel */}
            <div className="relative h-72">
              <img
                src={images[imgIndex]}
                className="w-full h-full object-cover"
              />

              {/* Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 px-3 py-2 rounded-full shadow"
                  >
                    ◀
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 px-3 py-2 rounded-full shadow"
                  >
                    ▶
                  </button>
                </>
              )}
            </div>

            {/* Details */}
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-2">
                {venue.name}
              </h2>

              <p className="text-gray-500 mb-2">{venue.sport}</p>

              <p className="text-lg font-semibold text-orange-600 mb-4">
                ₹{venue.price}/hr
              </p>

              {/* Slots */}
              <div className="flex flex-wrap gap-2">
                {slots.map((slot: any) => (
                  <button
                    key={slot.id}
                    onClick={() => handleBooking(slot.id)}
                    disabled={slot.isBooked}
                    className={`px-4 py-2 rounded-lg text-sm ${
                      slot.isBooked
                        ? "bg-gray-300 text-gray-600"
                        : "bg-orange-500 text-white hover:bg-orange-600"
                    }`}
                  >
                    {loadingId === slot.id
                      ? "..."
                      : slot.isBooked
                      ? "Booked"
                      : slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}