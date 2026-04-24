export default function VenueDetails({ data }: any) {
  return (
    <section>
      <h1 className="text-5xl font-black mb-4">{data.name}</h1>

      <p className="text-lg text-gray-500 mb-6">
        Designed for elite athletes and dedicated enthusiasts.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="p-6 bg-gray-100 rounded-xl">
          <div className="text-xs">Area</div>
          <div className="text-lg font-bold">12,000 sqft</div>
        </div>

        <div className="p-6 bg-gray-100 rounded-xl">
          <div className="text-xs">Capacity</div>
          <div className="text-lg font-bold">250 People</div>
        </div>
      </div>
    </section>
  );
}