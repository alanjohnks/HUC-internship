"use client";

import { useState } from "react";
import { signupUser } from "@/lib/api";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const roleInput = document.querySelector(
        'input[name="role"]:checked'
      ) as HTMLInputElement;

      const role = roleInput?.value || "user";

      const res = await signupUser({
        name,
        email,
        password,
        role,
      });

      console.log(res);

      if (res?.user) {
        alert("Signup successful");
        window.location.href = "/login";
      } else {
        alert(res?.error || "Signup failed");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Something went wrong");
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row">

      {/* LEFT SIDE (Image Section) */}
      <section className="hidden md:flex md:w-3/5 lg:w-2/3 relative overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDy3LW389xJBxL0NNoY1sJZjsvnBlwoIj2BANkfr_vlhBmy_F7SV5CSjDguYd-Qu7LsOHWB0cKchZDUdkUO_Qnl2UZTE_zCVg1aBFo9EtKdm56vK4v7oeTzSIwGMIw2YULkVGAc0QPcgJ6lzo3D74UQ_rvrJj53Tdeg_9s-6o8tZTwltm2sEG59-PYyxjV8TbIa8fi0j7Ga4P4vpCfcoDyQKkwMjExkoyNB_zzqwk75vJ6Fjq100FnsJfENZSxNC19vQ5gsCcnMT0WP"
            className="w-full h-full object-cover opacity-60"
            alt="background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
        </div>

        <div className="relative z-10 w-full flex flex-col justify-between p-16 text-white">
          <h1 className="text-4xl font-black italic text-orange-400">
            PRECISION
          </h1>

          <div>
            <h2 className="text-6xl font-black leading-tight mb-6">
              UNLOCK THE <br /> ARENA.
            </h2>
            <p className="text-gray-300 text-lg max-w-md">
              The ultimate operations engine for premium sports venues.
            </p>
          </div>

          <div className="flex gap-10">
            <div>
              <p className="text-2xl font-bold">500+</p>
              <p className="text-xs uppercase text-gray-400">Global Venues</p>
            </div>
            <div>
              <p className="text-2xl font-bold">12M+</p>
              <p className="text-xs uppercase text-gray-400">
                Bookings Managed
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* RIGHT SIDE (FORM) */}
      <section className="flex-grow flex items-center justify-center p-6 md:p-12 bg-gray-50">
        <div className="w-full max-w-md">

          {/* Header */}
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">
              Create Account
            </h2>
            <p className="text-gray-600 mt-2">
              Join the next generation of sports management.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full mt-2 p-4 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Email
              </label>
              <input
                type="email"
                placeholder="name@stadium.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 p-4 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 p-4 rounded-lg bg-white border border-gray-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div className="space-y-3">
              <span className="block text-sm font-bold text-gray-700 uppercase tracking-wide">
                I want to...
              </span>

              <div className="grid grid-cols-2 gap-4">

                <label className="relative flex flex-col p-4 rounded-xl cursor-pointer bg-white border border-gray-200 hover:shadow-md transition">
                  <input type="radio" name="role" value="user" className="hidden peer" />
                  <div className="absolute inset-0 border-2 border-transparent peer-checked:border-orange-500 rounded-xl"></div>
                  <span className="text-orange-500 text-lg mb-2">👤</span>
                  <span className="font-semibold text-gray-900">Book Venues</span>
                </label>

                <label className="relative flex flex-col p-4 rounded-xl cursor-pointer bg-white border border-gray-200 hover:shadow-md transition">
                  <input type="radio" name="role" value="owner" className="hidden peer" />
                  <div className="absolute inset-0 border-2 border-transparent peer-checked:border-orange-500 rounded-xl"></div>
                  <span className="text-orange-500 text-lg mb-2">🏟️</span>
                  <span className="font-semibold text-gray-900">Manage Facility</span>
                </label>

              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-lg bg-orange-500 text-white font-bold hover:scale-[1.02] transition"
            >
              Complete Registration →
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?
              <a href="/login" className="text-orange-500 font-bold ml-1">
                Login
              </a>
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}
