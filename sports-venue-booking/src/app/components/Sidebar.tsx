export default function Sidebar({ activeTab, setActiveTab }: any) {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-50 p-6 glass-sidebar">
      <h2 className="font-bold text-xl mb-10">Pro Arena Elite</h2>

      <nav className="space-y-4">
        <p
          onClick={() => setActiveTab("dashboard")}
          className={`cursor-pointer ${
            activeTab === "dashboard"
              ? "text-orange-600 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Dashboard
        </p>

        <p
          onClick={() => setActiveTab("explore")}
          className={`cursor-pointer ${
            activeTab === "explore"
              ? "text-orange-600 font-bold"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Explore
        </p>
      </nav>
    </aside>
  );
}