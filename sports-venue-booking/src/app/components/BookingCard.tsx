export default function BookingCard({ price }: any) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl sticky top-28 border border-gray-100">
      
      {/* Price Section */}
      <div className="mb-6">
        <p className="text-sm text-gray-400 mb-1">Starting from</p>
        <h2 className="text-5xl font-extrabold text-orange-600 tracking-tight">
          £{price}
          <span className="text-lg font-medium text-gray-500"> /hr</span>
        </h2>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 my-6"></div>

      {/* CTA */}
      <button className="w-full bg-orange-500 hover:bg-orange-600 transition-all duration-300 text-white py-4 rounded-xl font-semibold text-lg shadow-md hover:shadow-lg">
        Reserve Now
      </button>

      {/* Extra Trust Info */}
      <p className="text-xs text-gray-400 mt-4 text-center">
        Free cancellation • Instant confirmation
      </p>
    </div>
  );
}