

export default function AnalyticsCards() {
  const data =

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-xl">
          <p>Total Revenue</p>
          <h3 className="text-3xl font-black">${data.revenue}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl">
          <p>Bookings</p>
          <h3 className="text-3xl font-black">{data.bookings}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl">
          <p>Occupancy</p>
          <h3 className="text-3xl font-black">{data.occupancy}</h3>
        </div>

      </div>
    </section>
  );
}