export default function BookingTable({ data }: { data: any[] }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <table className="w-full text-left">
        <thead>
          <tr className="text-gray-500 text-sm">
            <th>Venue</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {Array.isArray(data) && data.length > 0 ? (
            data.map((booking) => (
              <tr key={booking.id} className="border-t">
                <td>{booking.slot?.venue?.name || "N/A"}</td>
                <td>{booking.slot?.time || "N/A"}</td>
                <td>{booking.status || "Confirmed"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="text-center py-4 text-gray-500">
                No bookings found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
