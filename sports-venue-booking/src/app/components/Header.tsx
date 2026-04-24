export default function Header() {
  return (
    <header className="flex justify-between items-center mb-10">
      <div>
        <h2 className="text-3xl font-extrabold tracking-tight text-on-surface">
          Admin Overview
        </h2>
        <p className="text-slate-500 font-medium">
          Monitoring platform health and venue operations.
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            search
          </span>
          <input
            className="pl-10 pr-4 py-2 bg-surface-container-highest border-none rounded-xl w-64 focus:ring-2 focus:ring-primary/20 transition-all text-sm"
            placeholder="Quick search..."
          />
        </div>

        <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-surface-container-low text-slate-600 hover:bg-slate-200 transition-colors">
          <span className="material-symbols-outlined">notifications</span>
        </button>

        <img
          className="w-10 h-10 rounded-xl object-cover ring-2 ring-surface-container-high"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCV0Kv61nXYrePydYFpMNkHWTOE27phOK626pSpDvaJoJ73C2FY_V18kTXXZvQ1GanvJ9uxSlVzvJ1t-w4p2Rmih1LMbIjhaZDydWTPDGtlat3dtGEZKmveq0wGYpU83LyaiCTr6jeXjQdt-19smNAJDiVbg6YYKkLVZ5Htgkw4pTt9Yw1asCcHU7dbSe7x6f0QJte59yqvvzflGojx0r8WyY3xHHQla5nWD4jlBUL0Vq3ExLvhSJMoWLvgs516SWm61fFs942EO9z9"
          alt="Admin"
        />
      </div>
    </header>
  );
}