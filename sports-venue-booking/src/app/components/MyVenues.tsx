"use client";

import { useEffect, useState } from "react";

export default function MyVenues() {
  const [venues, setVenues] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [editingVenue, setEditingVenue] =
    useState<any>(null);

  const [form, setForm] = useState({
    name: "",
    sport: "",
    price: "",
    location: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch(
        "/api/owners/venue",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      const data =
        await res.json();

      setVenues(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openEdit = (
    venue: any
  ) => {
    setEditingVenue(venue);

    setForm({
      name: venue.name || "",

      sport:
        venue.sport || "",

      price:
        venue.pricePerHour ||
        "",

      location:
        venue.location || "",
    });
  };

  const handleUpdate =
    async () => {
      try {
        const res =
          await fetch(
            `/api/venues/${editingVenue.id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization: `Bearer ${localStorage.getItem(
                  "token"
                )}`,
              },

              body: JSON.stringify(
                {
                  name: form.name,

                  sport:
                    form.sport,

                  price:
                    Number(
                      form.price
                    ),

                  location:
                    form.location,
                }
              ),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          alert(
            data.error ||
              "Update failed"
          );

          return;
        }

        setVenues((prev) =>
          prev.map((v) =>
            v.id === data.id
              ? data
              : v
          )
        );

        setEditingVenue(null);
      } catch (err: any) {
        console.error(err);

        alert(
          err.message ||
            "Something went wrong"
        );
      }
    };

  const handleDelete =
    async (id: string) => {
      const confirmDelete =
        confirm(
          "Are you sure you want to delete this venue?"
        );

      if (!confirmDelete)
        return;

      try {
        const res =
          await fetch(
            `/api/venues/${id}`,
            {
              method: "DELETE",

              headers: {
                Authorization: `Bearer ${localStorage.getItem(
                  "token"
                )}`,
              },
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          alert(
            data.error ||
              "Delete failed"
          );

          return;
        }

        setVenues((prev) =>
          prev.filter(
            (v) => v.id !== id
          )
        );
      } catch (err) {
        console.error(err);
      }
    };

  if (loading) {
    return (
      <div className="grid md:grid-cols-3 gap-6">
        <div className="h-48 bg-gray-200 animate-pulse rounded-xl" />

        <div className="h-48 bg-gray-200 animate-pulse rounded-xl" />

        <div className="h-48 bg-gray-200 animate-pulse rounded-xl" />
      </div>
    );
  }

  return (
    <>
      <section>
        <h2 className="text-2xl font-bold mb-6">
          My Venues
        </h2>

        {venues.length ===
        0 ? (
          <div className="bg-white p-6 rounded-xl text-center text-gray-500 shadow border">
            No venues created yet
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {venues.map((v) => (
              <div
                key={v.id}
                className="bg-white rounded-2xl shadow hover:shadow-xl transition overflow-hidden border border-gray-100"
              >
                <div className="h-40 w-full">
                  <img
                    src={
                      v.images?.[0] ||
                      "/placeholder.jpg"
                    }
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg text-gray-800">
                      {v.name}
                    </h3>

                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        v.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {v.approved
                        ? "Approved"
                        : "Pending"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400 mt-1">
                    {v.sport}
                  </p>

                  <p className="text-orange-600 font-bold mt-3 text-lg">
                    ₹
                    {v.pricePerHour}
                  </p>

                  <p className="text-sm text-gray-500 mt-1">
                    📍{" "}
                    {v.location}
                  </p>

                  <div className="mt-3 text-sm text-gray-600">
                    Slots:{" "}
                    {v.slots
                      ?.length || 0}
                  </div>

                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() =>
                        openEdit(v)
                      }
                      className="flex-1 bg-blue-500 hover:bg-blue-600 transition text-white py-2 rounded-xl font-medium"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(
                          v.id
                        )
                      }
                      className="flex-1 bg-red-500 hover:bg-red-600 transition text-white py-2 rounded-xl font-medium"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {editingVenue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() =>
                setEditingVenue(
                  null
                )
              }
              className="absolute top-4 right-4 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h3 className="text-2xl font-bold mb-6">
              Edit Venue
            </h3>

            <div className="space-y-4">
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
                      e.target
                        .value,
                  })
                }
                placeholder="Venue Name"
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
              />

              <input
                value={form.sport}
                onChange={(e) =>
                  setForm({
                    ...form,
                    sport:
                      e.target
                        .value,
                  })
                }
                placeholder="Sport"
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
              />

              <input
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price:
                      e.target
                        .value,
                  })
                }
                placeholder="Price"
                type="number"
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
              />

              <input
                value={
                  form.location
                }
                onChange={(e) =>
                  setForm({
                    ...form,
                    location:
                      e.target
                        .value,
                  })
                }
                placeholder="Location"
                className="w-full border border-gray-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <button
              onClick={
                handleUpdate
              }
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-xl font-semibold"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
}
