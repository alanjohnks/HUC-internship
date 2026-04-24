export default function BookingCard({ price }: any) {
  return (
    <div className="bg-white rounded-2xl p-8 shadow-lg sticky top-28">
      <div className="mb-6">
        <div className="text-sm text-gray-400">Starting from</div>
        <div className="text-4xl font-black text-orange-600">
          £{price}/hr
        </div>
      </div>

      <button className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold">
        Reserve Now
      </button>
    </div>
  );
}