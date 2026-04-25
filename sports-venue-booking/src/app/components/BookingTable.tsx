export default function BookingTable({ data }: { data: any[] }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
      {/* Header */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">
        Your Bookings
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="text-gray-400 text-sm uppercase tracking-wide border-b">
              <th className="py-3">Venue</th>
              <th className="py-3">Time</th>
              <th className="py-3">Status</th>
            </tr>
          </thead>

          <tbody>
            {Array.isArray(data) && data.length > 0 ? (
              data.map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="py-4 font-medium text-gray-800">
                    {booking.slot?.venue?.name || "N/A"}
                  </td>

                  <td className="py-4 text-gray-600">
                    {booking.slot?.time || "N/A"}
                  </td>

                  <td className="py-4">
                    <span className="px-3 py-1 text-sm rounded-full bg-green-100 text-green-700 font-medium">
                      {booking.status || "Confirmed"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center py-8 text-gray-400">
                  No bookings found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
