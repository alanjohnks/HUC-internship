"use client";

import { useEffect, useState } from "react";

export default function MyVenues() {
  const [venues, setVenues] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingVenue, setEditingVenue] = useState<any>(null);
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
      const res = await fetch("/api/owners/venue", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await res.json();
      setVenues(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Open edit modal
  const openEdit = (venue: any) => {
    setEditingVenue(venue);
    setForm({
      name: venue.name || "",
      sport: venue.sport || "",
      price: venue.price || "",
      location: venue.location || "",
    });
  };

  // 🔥 Update venue
  const handleUpdate = async () => {
  try {
    const res = await fetch(`/api/venues/${editingVenue.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(form),
    });

    let data;
    try {
      data = await res.json();
    } catch {
      throw new Error("Invalid server response");
    }

    if (!res.ok) {
      alert(data?.error || "Update failed");
      return;
    }

    setVenues((prev) =>
      prev.map((v) => (v.id === data.id ? data : v))
    );

    setEditingVenue(null);

  } catch (err: any) {
    alert(err.message);
  }
};

  // 🔥 Delete venue
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this venue?")) return;

    try {
      const res = await fetch(`/api/venues/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error);
        return;
      }

      // ✅ Remove from UI
      setVenues((prev) => prev.filter((v) => v.id !== id));
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
        <h2 className="text-2xl font-bold mb-6">My Venues</h2>

        {venues.length === 0 ? (
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
                    src={v.images?.[0] || "/placeholder.jpg"}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-4">
                  <div className="flex justify-between">
                    <h3 className="font-semibold text-lg">
                      {v.name}
                    </h3>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        v.approved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {v.approved ? "Approved" : "Pending"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-400">{v.sport}</p>

                  <p className="text-orange-600 font-bold mt-2">
                    ₹{v.price}
                  </p>

                  <p className="text-sm text-gray-500">
                    📍 {v.location}
                  </p>

                  <div className="mt-3 text-sm text-gray-600">
                    Slots: {v.slots?.length || 0}
                  </div>

                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={() => openEdit(v)}
                      className="flex-1 bg-blue-500 text-white py-1 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(v.id)}
                      className="flex-1 bg-red-500 text-white py-1 rounded-lg"
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

      {/* 🔥 EDIT MODAL */}
      {editingVenue && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          
          <div className="bg-white w-[90%] max-w-md rounded-2xl p-6 shadow-xl relative">
            
            <button
              onClick={() => setEditingVenue(null)}
              className="absolute top-3 right-3"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold mb-4">
              Edit Venue
            </h3>

            <div className="space-y-3">
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                placeholder="Name"
                className="w-full border p-2 rounded"
              />

              <input
                value={form.sport}
                onChange={(e) =>
                  setForm({ ...form, sport: e.target.value })
                }
                placeholder="Sport"
                className="w-full border p-2 rounded"
              />

              <input
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
                placeholder="Price"
                className="w-full border p-2 rounded"
              />

              <input
                value={form.location}
                onChange={(e) =>
                  setForm({ ...form, location: e.target.value })
                }
                placeholder="Location"
                className="w-full border p-2 rounded"
              />
            </div>

            <button
              onClick={handleUpdate}
              className="w-full mt-4 bg-orange-500 text-white py-2 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
    </>
  );
}