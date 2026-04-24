import { getUsers } from "../data/adminDummyData";

export default function UserModeration() {
  const users = getUsers();

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-extrabold">User Moderation</h3>
      </div>

      <div className="bg-surface-container-low rounded-[24px] p-6 space-y-4">
        {users.map((user, i) => (
          <div
            key={i}
            className="bg-surface-container-lowest p-4 rounded-2xl flex items-center gap-4 hover:translate-x-1 transition-all"
          >
            <div className="w-12 h-12 bg-slate-200 rounded-xl" />

            <div className="flex-1">
              <h4 className="font-bold text-sm">{user.name}</h4>

              <div className="flex items-center gap-2 text-[10px]">
                <span className="uppercase font-bold">{user.role}</span>
                <span>•</span>
                <span
                  className={
                    user.status === "Active"
                      ? "text-green-600 font-bold"
                      : "text-orange-500 font-bold"
                  }
                >
                  {user.status}
                </span>
              </div>
            </div>

            <button className="text-slate-400 hover:text-primary">
              ⋮
            </button>
          </div>
        ))}

        <button className="w-full py-3 rounded-xl border border-dashed text-xs font-bold">
          View All Moderation Cases
        </button>
      </div>

      {/* Quick Card */}
      <div className="bg-primary p-6 rounded-[24px] text-white">
        <h4 className="font-extrabold text-lg">
          System Settings Maintenance
        </h4>
        <p className="text-xs mt-2">
          Scheduled system optimization in 4 hours.
        </p>
      </div>
    </section>
  );
}