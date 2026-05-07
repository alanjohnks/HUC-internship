export default function Navbar() {
  return (
    <nav className="bg-[#f7f9fb]/80 backdrop-blur-xl sticky top-0 z-50 shadow-[0_32px_64px_-15px_rgba(25,28,30,0.06)]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
        <div className="text-2xl font-black italic text-[#ff6b00]">Pro Arena Elite</div>

        <div className="hidden md:flex items-center gap-8">
          <a className="text-[#ff6b00] border-b-4 border-[#ff6b00] pb-1 font-bold text-sm">Venues</a>
          <a className="text-[#515f78] font-bold text-sm">Bookings</a>
          <a className="text-[#515f78] font-bold text-sm">Memberships</a>
          <a className="text-[#515f78] font-bold text-sm">Analytics</a>
        </div>

        <div className="flex gap-4">
          <button className="font-bold text-sm">Login</button>
          <button className="bg-linear-to-br from-primary to-primary-container px-6 py-2.5 rounded-lg text-white text-sm font-bold">
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  );
}