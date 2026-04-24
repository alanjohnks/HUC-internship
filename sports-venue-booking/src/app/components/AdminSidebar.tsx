"use client";

export default function AdminSidebar({ active, setActive }: any) {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-50 p-6">
      <h2 className="font-bold text-xl mb-10">Admin Panel</h2>

      <nav className="space-y-4">
        {[
          { key: "dashboard", label: "Dashboard" },
          { key: "pending", label: "Pending Venues" },
          { key: "bookings", label: "All Bookings" },
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