export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-slate-50 p-6 glass-sidebar">
      <h2 className="font-bold text-xl mb-10">Pro Arena Elite</h2>

      <nav className="space-y-4">
        <a className="text-orange-600 font-bold">Dashboard</a>
        <br/>
        <a className="text-gray-500">Explore</a>
        <br/>
        <a className="text-gray-500">My Bookings</a>
      </nav>
    </aside>
  );
}