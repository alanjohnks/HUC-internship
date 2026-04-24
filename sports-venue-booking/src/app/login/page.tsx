"use client";

import { useState } from "react";
import { Manrope } from "next/font/google";
import { loginUser } from "@/lib/api";
import { useRouter } from "next/navigation";

const manrope = Manrope({ subsets: ["latin"] });

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await loginUser({ email, password });

      if (res.user) {
        localStorage.setItem("user", JSON.stringify(res.user));
        localStorage.setItem("token", res.token);
        router.push("/dashboard");
      } else {
        console.log(res);
        alert(res.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <main
      className={`min-h-screen flex items-center justify-center p-4 bg-gray-50 ${manrope.className}`}
    >
      <div className="w-full max-w-6xl grid md:grid-cols-2 bg-white rounded-xl overflow-hidden shadow-lg">
        {/* Left Section */}
        <section
          className="hidden md:flex flex-col justify-between p-12 text-white"
          style={{
            backgroundImage:
              "linear-gradient(rgba(25,28,30,0.6), rgba(25,28,30,0.6)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuBMfiPSob3JU5iL5mE85Xio1HUxK-EfDGBx2bhDQbQ9UbAReU_8nPQ9lnx-49CRSFKxPNHSUWV_SDS_nqoPLgaK4nEl2AYrsGXoPcC5N9B9z2i6XVEI3H3wJ8k1IEZ-Jc1cSu3BJ2SOFfHWN96QSk8-5_kW4UiMIx3G_moDgCIEuP11GSbjUxxGQkDTYXHMkHZKfnX3gyt_uHnOH1CM8ddM59urSnxvcMWOhwnYQS96AQr6PrZRUwOIUKgQe8nJRCoMHb9u9EJZ1CaW')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <div>
            <h2 className="text-3xl font-extrabold italic tracking-tight text-orange-400">
              PRECISION
            </h2>
            <p className="mt-2 text-lg opacity-80 max-w-xs">
              Elevate your venue management to elite performance levels.
            </p>
          </div>
        </section>

        {/* Right Section */}
        <section className="p-8 md:p-16 flex flex-col justify-center">
          <div className="mb-10">
            <h1 className="text-4xl text-gray-900 font-extrabold">Login</h1>
            <p className="text-gray-600 mt-2">
              Access your venue management dashboard
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="text-xs font-bold uppercase text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                placeholder="name@stadium.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mt-2 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-xs font-bold uppercase text-gray-700">
                Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mt-2 p-4 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Remember */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <span className="text-sm text-gray-600">
                Remember this device
              </span>
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-lg bg-orange-500 text-white font-bold hover:scale-[1.02] transition"
            >
              Login →
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
