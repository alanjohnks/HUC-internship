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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

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
          images: form.images.split(","), // comma separated URLs
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error);

      alert("Venue added!");
      setForm({ name: "", sport: "", price: "", location: "", images: "" });

    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input name="name" placeholder="Venue Name" value={form.name} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="sport" placeholder="Sport" value={form.sport} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="price" placeholder="Price" value={form.price} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="location" placeholder="Location" value={form.location} onChange={handleChange} className="w-full p-2 border rounded" />
      <input name="images" placeholder="Image URLs (comma separated)" value={form.images} onChange={handleChange} className="w-full p-2 border rounded" />

      <button className="bg-orange-500 text-white px-4 py-2 rounded">
        Add Venue
      </button>
    </form>
  );
}