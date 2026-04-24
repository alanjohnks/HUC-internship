import { getVenues } from "../data/ownerDummyData";

export default function VenueList() {
  const venues = getVenues();

  return (
    <section className="space-y-4">
      {venues.map(v => (
        <div key={v.id} className="bg-white p-4 rounded-xl flex items-center">

          <img src={v.image} className="w-32 h-20 rounded-lg object-cover"/>

          <div className="ml-6 flex-1">
            <h4 className="font-bold">{v.name}</h4>
            <p className="text-xs text-gray-500">{v.type}</p>
          </div>

          <button className="px-5 py-2 bg-gray-100 rounded-lg">
            Edit
          </button>

        </div>
      ))}
    </section>
  );
}