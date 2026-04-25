"use client";

import { useState } from "react";

export default function AddVenue() {
  const [form, setForm] = useState({
    name: "",
    sport: "",
    price: "",
    location: "",
    images: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/venues", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          images: form.images
            ? form.images.split(",").map((img) => img.trim())
            : [],
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert("Venue added successfully!");

      setForm({
        name: "",
        sport: "",
        price: "",
        location: "",
        images: "",
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const previewImages = form.images
    ? form.images.split(",").map((img) => img.trim())
    : [];

  return (
    <section className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Venue</h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow border border-gray-100 space-y-5"
      >
        {/* Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Venue Name
          </label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="e.g. Elite Football Arena"
            className="w-full mt-1 p-3 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Sport */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Sport
          </label>
          <input
            name="sport"
            value={form.sport}
            onChange={handleChange}
            placeholder="Football, Cricket..."
            className="w-full mt-1 p-3 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Price */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Price (₹/hr)
          </label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            placeholder="500"
            className="w-full mt-1 p-3 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Location */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Bangalore"
            className="w-full mt-1 p-3 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        {/* Images */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            Image URLs (comma separated)
          </label>
          <input
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="https://img1.jpg, https://img2.jpg"
            className="w-full mt-1 p-3 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none"
          />

          {/* 🔥 Preview */}
          {previewImages.length > 0 && (
            <div className="flex gap-2 mt-3 overflow-x-auto">
              {previewImages.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="w-20 h-20 object-cover rounded-lg border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-3 rounded-xl font-semibold text-white transition ${
            loading
              ? "bg-gray-400"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading ? "Adding..." : "Add Venue"}
        </button>
      </form>
    </section>
  );
}