"use client";

import { useState } from "react";

export default function Menu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="bg-slate-900 text-white px-6 py-3">
      <div className="flex justify-between items-center">

        <div className="relative">
              
          <div
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-20 h-10 bg-black rounded-full flex items-center justify-center cursor-pointer"
          >
            Menu
          </div>

          {menuOpen && (
            <div className="absolute left-0 mt-2 w-40 bg-white text-black rounded-lg shadow-lg">

              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Profile
              </div>

              <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer">
                Logout
              </div>

            </div>
          )}

        </div>
      </div>
    </header>
  );
}
