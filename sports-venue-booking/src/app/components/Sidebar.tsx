export default function Sidebar({
  activeTab,
  setActiveTab,
}: any) {
  const navItems = [
    {
      label: "Dashboard",
      value: "dashboard",
    },

    {
      label: "Explore",
      value: "explore",
    },

    {
      label: "Matches",
      value: "matches",
    },

    {
      label: "Chats",
      value: "chats",
    },

    {
      label: "Profile",
      value: "profile",
    },
    {
  label: "Notifications",
  value: "notifications",
},
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-50 border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h2 className="font-bold text-2xl text-gray-800">
          Pro Arena Elite
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Sports Match Platform
        </p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.value}
            onClick={() =>
              setActiveTab(item.value)
            }
            className={`w-full text-left px-4 py-3 rounded-xl transition font-medium ${
              activeTab === item.value
                ? "bg-orange-100 text-orange-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="bg-orange-50 rounded-xl p-4">
          <p className="text-sm font-semibold text-orange-700">
            Match System Active
          </p>

          <p className="text-xs text-orange-500 mt-1">
            Public & private games enabled
          </p>
        </div>
      </div>
    </aside>
  );
}