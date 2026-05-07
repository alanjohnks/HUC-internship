"use client";

import { useEffect, useState } from "react";

export default function PendingVenues() {
  const [venues, setVenues] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const fetchVenues = async () => {
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

    if (!res.ok) {
      console.error(data);

      setVenues([]);

      return;
    }

    setVenues(
      Array.isArray(data)
        ? data
        : []
    );
  } catch (error) {
    console.error(error);

    setVenues([]);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchVenues();
  }, []);

  const approveVenue = async (
    id: string
  ) => {
    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "/api/admin/approve",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            venueId: id,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.error ||
            "Failed to approve venue"
        );

        return;
      }

      setVenues((prev) =>
        prev.filter((v) => v.id !== id)
      );

      alert("Venue approved");
    } catch (error) {
      console.error(error);

      alert("Something went wrong");
    }
  };

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-800">
          Pending Venues
        </h2>

        <p className="text-gray-500 mt-2">
          Review and approve newly
          submitted sports venues
        </p>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          <div className="h-72 bg-gray-200 animate-pulse rounded-3xl" />
          <div className="h-72 bg-gray-200 animate-pulse rounded-3xl" />
          <div className="h-72 bg-gray-200 animate-pulse rounded-3xl" />
        </div>
      ) : venues.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
          <h3 className="text-2xl font-bold text-gray-700">
            No Pending Venues
          </h3>

          <p className="text-gray-500 mt-3">
            All submitted venues have
            been reviewed
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {venues.map((venue) => (
            <div
              key={venue.id}
              className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg transition"
            >
              <div className="relative">
                <img
                  src={
                    venue.images?.[0] ||
                    "https://placehold.co/600x400"
                  }
                  alt={venue.name}
                  className="w-full h-52 object-cover"
                />

                <div className="absolute top-4 right-4 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Pending
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {venue.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {venue.location}
                    </p>
                  </div>

                  <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-xs font-semibold">
                    {venue.sport}
                  </span>
                </div>

                <div className="mt-5 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Price / Hour
                    </span>

                    <span className="font-semibold text-gray-800">
                      ₹
                      {venue.pricePerHour ||
                        venue.price}
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Owner
                    </span>

                    <span className="font-medium text-gray-700">
                      {
                        venue.owner
                          ?.name
                      }
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      Email
                    </span>

                    <span className="font-medium text-gray-700 text-right">
                      {
                        venue.owner
                          ?.email
                      }
                    </span>
                  </div>
                </div>

                {venue.description && (
                  <p className="text-sm text-gray-500 mt-5 line-clamp-3">
                    {venue.description}
                  </p>
                )}

                <button
                  onClick={() =>
                    approveVenue(
                      venue.id
                    )
                  }
                  className="w-full mt-6 bg-green-500 hover:bg-green-600 transition text-white py-3 rounded-2xl font-semibold"
                >
                  Approve Venue
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}