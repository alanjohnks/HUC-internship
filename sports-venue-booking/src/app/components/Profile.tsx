"use client";

import BookingTable from "./BookingTable";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile({ user, bookings, loading }: any) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });

  const handleUpdate = async () => {
  try {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/users", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || "Update failed");
      return;
    }

    
    localStorage.setItem("user", JSON.stringify(data));

    
    setForm({
      name: data.name,
      email: data.email,
    });

  
    router.refresh();

    alert("Profile updated!");
    setEditing(false);

  } catch (err) {
    console.error(err);
    alert("Something went wrong");
  }
};

  const handleLogout = () => {
    localStorage.removeItem("token");

    // Optional: clear other stuff
    localStorage.removeItem("user");

    // Redirect to login
    router.push("/login");
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">My Profile</h2>

      {/* 🔷 Profile Card */}
      <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-gray-100">
        
        <div className="flex items-center gap-6">
          
          {/* Avatar */}
          <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold">
            {form.name?.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1">
            {editing ? (
              <div className="space-y-2">
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  className="border px-3 py-1 rounded w-full"
                />

                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                  className="border px-3 py-1 rounded w-full"
                />
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800">
                  {user?.name}
                </h3>
                <p className="text-gray-500">{user?.email}</p>
              </>
            )}

            <span className="inline-block mt-1 px-3 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          {editing ? (
            <>
              <button
                onClick={handleUpdate}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
              >
                Save
              </button>

              <button
                onClick={() => setEditing(false)}
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600"
            >
              Edit Profile
            </button>
          )}

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔷 Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <p className="text-sm text-gray-400">Total Bookings</p>
          <p className="text-2xl font-bold text-gray-800">
            {bookings?.length || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <p className="text-sm text-gray-400">Status</p>
          <p className="text-lg font-semibold text-green-600">
            Active
          </p>
        </div>
      </div>

      {/* 🔷 Booking History */}
      <div>
        <h3 className="text-xl font-semibold mb-4">
          Booking History
        </h3>

        {loading ? (
          <div className="h-32 bg-gray-200 animate-pulse rounded-xl" />
        ) : bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet</p>
        ) : (
          <BookingTable data={bookings} />
        )}
      </div>
    </section>
  );
}