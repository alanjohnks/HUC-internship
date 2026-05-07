"use client";

import { useState } from "react";

export default function AddVenue() {
  const [form, setForm] = useState({
    name: "",
    sport: "",
    pricePerHour: "",
    location: "",
    description: "",
    images: "",
  });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    setLoading(true);

    try {
      const token =
        localStorage.getItem("token");

      const res = await fetch(
        "/api/venues",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            name: form.name,

            sport: form.sport,

            pricePerHour: Number(
              form.pricePerHour
            ),

            location:
              form.location || null,

            description:
              form.description || null,

            images: form.images
              ? form.images
                  .split(",")
                  .map((img) =>
                    img.trim()
                  )
              : [],
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error ||
            "Failed to create venue"
        );
      }

      alert(
        "Venue created successfully"
      );

      setForm({
        name: "",
        sport: "",
        pricePerHour: "",
        location: "",
        description: "",
        images: "",
      });
    } catch (err: any) {
      console.error(err);

      alert(
        err.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  const previewImages = form.images
    ? form.images
        .split(",")
        .map((img) => img.trim())
    : [];

  return (
    <section className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Add New Venue
        </h2>

        <p className="text-gray-500 mt-2">
          Create a venue and start
          hosting public/private
          matches
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-3xl shadow border border-gray-100 space-y-6"
      >
        <div>
          <label className="text-sm font-semibold text-gray-700">
            Venue Name
          </label>

          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Elite Football Arena"
            className="w-full mt-2 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Sport
          </label>

          <input
            name="sport"
            value={form.sport}
            onChange={handleChange}
            placeholder="Football, Cricket, Badminton..."
            className="w-full mt-2 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Price Per Hour
          </label>

          <input
            name="pricePerHour"
            type="number"
            value={form.pricePerHour}
            onChange={handleChange}
            placeholder="1500"
            className="w-full mt-2 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Location
          </label>

          <input
            name="location"
            value={form.location}
            onChange={handleChange}
            placeholder="Bangalore"
            className="w-full mt-2 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Description
          </label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Describe your venue..."
            rows={5}
            className="w-full mt-2 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-gray-700">
            Image URLs
          </label>

          <input
            name="images"
            value={form.images}
            onChange={handleChange}
            placeholder="https://img1.jpg, https://img2.jpg"
            className="w-full mt-2 p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-orange-400 outline-none"
          />

          {previewImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
              {previewImages.map(
                (img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="preview"
                    className="w-full h-28 object-cover rounded-2xl border border-gray-100"
                  />
                )
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-semibold text-white transition ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          {loading
            ? "Creating Venue..."
            : "Create Venue"}
        </button>
      </form>
    </section>
  );
}