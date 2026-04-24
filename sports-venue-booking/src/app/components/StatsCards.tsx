import { getStats } from "../data/adminDummyData";

export default function StatsCards() {
  const stats = getStats();

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      {stats.map((item, i) => (
        <div key={i} className="bg-surface-container-lowest p-6 rounded-[24px] shadow-sm">
          <p className="text-slate-500 text-sm font-semibold uppercase">
            {item.title}
          </p>
          <h3 className="text-4xl font-extrabold">{item.value}</h3>
          <span className="text-green-600 text-xs font-bold">
            {item.change}
          </span>
        </div>
      ))}
    </section>
  );
}