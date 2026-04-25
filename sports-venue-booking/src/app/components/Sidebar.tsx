export default function Sidebar({ activeTab, setActiveTab }: any) {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-50 p-6 border-r">
      
      {/* Logo */}
      <h2 className="font-bold text-xl mb-10 text-gray-800">
        Pro Arena Elite
      </h2>

      {/* Nav */}
      <nav className="space-y-4">
        
        <p
          onClick={() => setActiveTab("dashboard")}
          className={`cursor-pointer px-3 py-2 rounded-lg transition ${
            activeTab === "dashboard"
              ? "bg-orange-100 text-orange-600 font-semibold"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Dashboard
        </p>

        <p
          onClick={() => setActiveTab("explore")}
          className={`cursor-pointer px-3 py-2 rounded-lg transition ${
            activeTab === "explore"
              ? "bg-orange-100 text-orange-600 font-semibold"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Explore
        </p>

        {/* 🔥 NEW PROFILE TAB */}
        <p
          onClick={() => setActiveTab("profile")}
          className={`cursor-pointer px-3 py-2 rounded-lg transition ${
            activeTab === "profile"
              ? "bg-orange-100 text-orange-600 font-semibold"
              : "text-gray-500 hover:bg-gray-100"
          }`}
        >
          Profile
        </p>
      </nav>
    </aside>
  );
}