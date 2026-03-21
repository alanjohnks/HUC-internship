"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
  const res = await fetch("/api/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (res.ok) {
    localStorage.setItem("user", email);
    window.location.href = "/";
  } else {
    alert(data.error);
  }
};


  return (
    
    <div className="min-h-screen flex justify-center items-center bg-slate-900">
      <div className="bg-slate-800 p-6 rounded-xl w-80 space-y-4">
        <h1 className="text-white text-xl font-bold text-center">Login</h1>

        <input
          className="w-full p-3 rounded bg-slate-700 text-white"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 rounded bg-slate-700 text-white"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 p-3 rounded text-white"
        >
          Login
        </button>
      </div>
    </div>
  );
}
