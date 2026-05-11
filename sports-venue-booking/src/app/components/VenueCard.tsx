"use client";

import { createMatch } from "@/lib/api";
import { useState } from "react";

export default function VenueCard({
  venue,
}: any) {
  const [slots] = useState(
    venue.slots || []
  );

  const [loadingId, setLoadingId] =
    useState<string | null>(null);

  const [openModal, setOpenModal] =
    useState(false);

  const [imgIndex, setImgIndex] =
    useState(0);

  const [visibility, setVisibility] =
    useState<"PRIVATE" | "PUBLIC">(
      "PRIVATE"
    );

  const [maxPlayers, setMaxPlayers] =
    useState(2);

  const images = venue.images?.length
    ? venue.images
    : ["/placeholder.jpg"];

  const handleBooking = async (
    slotId: string
  ) => {
    try {
      setLoadingId(slotId);

      const slot = slots.find(
        (s: any) => s.id === slotId
      );

      if (!slot) return;

      if (slot.isBooked) {
        alert("Slot already booked");
        return;
      }

      const totalPrice =
        venue.pricePerHour || 0;

      const res = await createMatch({
        title: `${venue.sport} Match`,

        description: `${visibility} game at ${venue.name}`,

        sport: venue.sport,

        visibility,

        maxPlayers:
          visibility === "PRIVATE"
            ? 1
            : maxPlayers,

        totalPrice,

        venueId: venue.id,

        slotId,
      });

      if (res.error) {
        alert(res.error);
        return;
      }

      alert(
        visibility === "PRIVATE"
          ? "Private booking created"
          : "Public match created"
      );

      setOpenModal(false);
    } catch (error) {
      console.error(error);

      alert("Failed to create match");
    } finally {
      setLoadingId(null);
    }
  };

  const nextImage = () => {
    setImgIndex(
      (prev) => (prev + 1) % images.length
    );
  };

  const prevImage = () => {
    setImgIndex((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1
    );
  };

  return (
    <>
      <div
        onClick={() => setOpenModal(true)}
        className="bg-white rounded-2xl shadow-md hover:shadow-xl transition overflow-hidden border border-gray-100 cursor-pointer"
      >
        <div className="h-48 w-full">
          <img
            src={images[0]}
            alt={venue.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-lg text-gray-800 truncate">
            {venue.name}
          </h3>

          <p className="text-sm text-gray-400">
            {venue.sport}
          </p>

          <p className="text-xl font-bold text-orange-600 mt-2">
            ₹{venue.pricePerHour}

            <span className="text-sm text-gray-400">
              {" "}
              /hr
            </span>
          </p>
        </div>
      </div>

      {openModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-5">
          <div className="bg-white w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative max-h-[95vh] overflow-y-auto">
            <button
              onClick={() =>
                setOpenModal(false)
              }
              className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full shadow z-10"
            >
              ✕
            </button>

            <div className="relative h-80">
              <img
                src={images[imgIndex]}
                className="w-full h-full object-cover"
              />

              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 px-4 py-3 rounded-full shadow"
                  >
                    ◀
                  </button>

                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 px-4 py-3 rounded-full shadow"
                  >
                    ▶
                  </button>
                </>
              )}
            </div>

            <div className="p-8">
              <div className="flex items-start justify-between gap-6 mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800">
                    {venue.name}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    {venue.location}
                  </p>

                  <div className="flex items-center gap-3 mt-4">
                    <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-sm font-medium">
                      {venue.sport}
                    </span>

                    <span className="text-2xl font-bold text-orange-600">
                      ₹
                      {
                        venue.pricePerHour
                      }
                      /hr
                    </span>
                  </div>
                </div>
              </div>

              {venue.description && (
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-2">
                    Description
                  </h3>

                  <p className="text-gray-600 leading-relaxed">
                    {venue.description}
                  </p>
                </div>
              )}

              <div className="mb-8">
                <h3 className="font-semibold text-lg mb-4">
                  Booking Type
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <button
                    onClick={() =>
                      setVisibility(
                        "PRIVATE"
                      )
                    }
                    className={`border rounded-2xl p-5 text-left transition ${
                      visibility ===
                      "PRIVATE"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200"
                    }`}
                  >
                    <h4 className="font-bold text-lg">
                      Private Court
                    </h4>

                    <p className="text-sm text-gray-500 mt-2">
                      Entire ground reserved
                      only for you
                    </p>
                  </button>

                  <button
                    onClick={() =>
                      setVisibility(
                        "PUBLIC"
                      )
                    }
                    className={`border rounded-2xl p-5 text-left transition ${
                      visibility ===
                      "PUBLIC"
                        ? "border-orange-500 bg-orange-50"
                        : "border-gray-200"
                    }`}
                  >
                    <h4 className="font-bold text-lg">
                      Public Match
                    </h4>

                    <p className="text-sm text-gray-500 mt-2">
                      Players can join and
                      split the payment
                    </p>
                  </button>
                </div>
              </div>

              {visibility === "PUBLIC" && (
                <div className="mb-8">
                  <h3 className="font-semibold text-lg mb-4">
                    Number of Players
                  </h3>

                  <select
                    value={maxPlayers}
                    onChange={(e) =>
                      setMaxPlayers(
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="border border-gray-200 rounded-xl px-4 py-3 outline-none"
                  >
                    {[2, 4, 6, 8, 10].map(
                      (count) => (
                        <option
                          key={count}
                          value={count}
                        >
                          {count} Players
                        </option>
                      )
                    )}
                  </select>

                  <div className="mt-4 bg-orange-50 rounded-xl p-4">
                    <p className="text-sm text-gray-600">
                      Each player pays:
                    </p>

                    <p className="text-2xl font-bold text-orange-600 mt-1">
                      ₹
                      {Math.ceil(
                        venue.pricePerHour /
                          maxPlayers
                      )}
                    </p>
                  </div>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-lg mb-4">
                  Available Slots
                </h3>

                <div className="flex flex-wrap gap-3">
                  {slots.map((slot: any) => {
                    const timeText = `${new Date(
                      slot.startTime
                    ).toLocaleTimeString(
                      [],
                      {
                        hour:
                          "2-digit",
                        minute:
                          "2-digit",
                      }
                    )} - ${new Date(
                      slot.endTime
                    ).toLocaleTimeString(
                      [],
                      {
                        hour:
                          "2-digit",
                        minute:
                          "2-digit",
                      }
                    )}`;

                    return (
                      <button
                        key={slot.id}
                        onClick={() =>
                          handleBooking(
                            slot.id
                          )
                        }
                        disabled={
                          loadingId ===
                            slot.id ||
                          slot.isBooked
                        }
                        className={`px-5 py-3 rounded-xl text-white transition
                          ${
                            slot.isBooked
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-orange-500 hover:bg-orange-600"
                          }
                        `}
                      >
                        {slot.isBooked
                          ? "Booked"
                          : loadingId ===
                              slot.id
                            ? "Creating..."
                            : timeText}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}