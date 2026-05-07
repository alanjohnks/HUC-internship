"use client";

import MatchTable from "./MatchTable";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Profile({
  user,
  matches = [],
  loading,
}: any) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: user?.bio || "",
    profileImage: user?.profileImage || "",
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

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      setForm({
        name: data.name,
        email: data.email,
        bio: data.bio || "",
        profileImage:
          data.profileImage || "",
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

    localStorage.removeItem("user");

    router.push("/login");
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">
        My Profile
      </h2>

      <div className="bg-white rounded-2xl shadow p-6 mb-6 border border-gray-100">
        <div className="flex items-center gap-6">
          {form.profileImage ? (
            <img
              src={form.profileImage}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-orange-500 text-white flex items-center justify-center text-xl font-bold">
              {form.name?.charAt(0)}
            </div>
          )}

          <div className="flex-1">
            {editing ? (
              <div className="space-y-2">
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  className="border px-3 py-2 rounded w-full"
                  placeholder="Name"
                />

                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  className="border px-3 py-2 rounded w-full"
                  placeholder="Email"
                />

                <input
                  value={form.profileImage}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      profileImage:
                        e.target.value,
                    })
                  }
                  className="border px-3 py-2 rounded w-full"
                  placeholder="Profile image URL"
                />

                <textarea
                  value={form.bio}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      bio: e.target.value,
                    })
                  }
                  className="border px-3 py-2 rounded w-full"
                  placeholder="Bio"
                />
              </div>
            ) : (
              <>
                <h3 className="text-xl font-semibold text-gray-800">
                  {user?.name}
                </h3>

                <p className="text-gray-500">
                  {user?.email}
                </p>

                {user?.bio && (
                  <p className="text-sm text-gray-600 mt-2">
                    {user.bio}
                  </p>
                )}
              </>
            )}

            <span className="inline-block mt-2 px-3 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
              {user?.role}
            </span>
          </div>
        </div>

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
                onClick={() =>
                  setEditing(false)
                }
                className="bg-gray-200 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() =>
                setEditing(true)
              }
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <p className="text-sm text-gray-400">
            Total Matches
          </p>

          <p className="text-2xl font-bold text-gray-800">
            {matches?.length || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <p className="text-sm text-gray-400">
            Followers
          </p>

          <p className="text-2xl font-bold text-blue-600">
            {user?.followersCount || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <p className="text-sm text-gray-400">
            Following
          </p>

          <p className="text-2xl font-bold text-purple-600">
            {user?.followingCount || 0}
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow border border-gray-100">
          <p className="text-sm text-gray-400">
            Status
          </p>

          <p className="text-lg font-semibold text-green-600">
            Active
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">
          Match History
        </h3>

        {loading ? (
          <div className="h-32 bg-gray-200 animate-pulse rounded-xl" />
        ) : matches.length === 0 ? (
          <p className="text-gray-500">
            No matches yet
          </p>
        ) : (
          <MatchTable data={matches} currentUser={user} />
        )}
      </div>
    </section>
  );
}