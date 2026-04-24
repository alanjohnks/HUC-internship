import { getApprovals } from "../data/adminDummyData";

export default function ApprovalTable() {
  const approvals = getApprovals();

  return (
    <section className="xl:col-span-2 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold">Venue Approval Queue</h3>
        <button className="text-sm font-bold text-primary hover:underline">
          View All Requests
        </button>
      </div>

      <div className="bg-surface-container-lowest rounded-[24px] overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-surface-container-low">
            <tr>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                Venue Name
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                Owner
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                Location
              </th>
              <th className="px-6 py-4 text-xs font-black uppercase text-slate-500">
                Date
              </th>
              <th className="px-6 py-4 text-xs font-black text-right text-slate-500">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {approvals.map((item, i) => (
              <tr key={i} className="hover:bg-surface-container-low/50">
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.img}
                      className="w-10 h-10 rounded-lg object-cover"
                    />
                    <span className="font-bold">{item.name}</span>
                  </div>
                </td>

                <td className="px-6 py-5 text-sm">{item.owner}</td>
                <td className="px-6 py-5 text-sm">{item.location}</td>
                <td className="px-6 py-5 text-sm">{item.date}</td>

                <td className="px-6 py-5 text-right space-x-2">
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg">
                    ✓
                  </button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}