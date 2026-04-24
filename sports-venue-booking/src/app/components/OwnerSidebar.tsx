"use client";

export default function OwnerSidebar({ active, setActive }: any) {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-50 p-6">
      <h2 className="font-bold text-xl mb-10">Owner Panel</h2>

      <nav className="space-y-4">
        {[
          { key: "dashboard", label: "Dashboard" },
          { key: "add", label: "Add Venue" },
          { key: "venues", label: "My Venues" },
          { key: "bookings", label: "Bookings" },
        ].map((item) => (
          <p
            key={item.key}
            onClick={() => setActive(item.key)}
            className={`cursor-pointer ${
              active === item.key
                ? "text-orange-600 font-bold"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {item.label}
          </p>
        ))}
      </nav>
    </aside>
  );
}