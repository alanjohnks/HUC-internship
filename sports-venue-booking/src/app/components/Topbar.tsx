export default function Topbar() {
  return (
    <header className="sticky top-0 bg-white/70 backdrop-blur px-8 py-4 flex justify-between">
      <input
        placeholder="Find a venue"
        className="bg-gray-100 px-4 py-2 rounded-full w-80"
      />
      <div>Profile</div>
    </header>
  );
}