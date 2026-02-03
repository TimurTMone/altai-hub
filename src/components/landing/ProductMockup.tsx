export function ProductMockup() {
  const rows = [
    { rank: 1, name: "Alex K.", xp: "2,840", level: "12" },
    { rank: 2, name: "Sam R.", xp: "2,651", level: "11" },
    { rank: 3, name: "Jordan M.", xp: "2,420", level: "10" },
    { rank: 4, name: "Casey L.", xp: "2,198", level: "10" },
    { rank: 5, name: "You", xp: "—", level: "—" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-4xl px-4 pt-8 sm:pt-12 md:pt-16">
      {/* Glow behind the mockup */}
      <div
        className="absolute left-1/2 top-1/2 h-[90%] w-[95%] -translate-x-1/2 -translate-y-1/2 rounded-3xl opacity-30"
        style={{
          background: "radial-gradient(ellipse, rgba(120, 80, 220, 0.4) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        aria-hidden
      />
      {/* Browser / app frame */}
      <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/90 shadow-2xl shadow-black/50 backdrop-blur-sm sm:rounded-3xl">
        {/* Title bar */}
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 sm:px-6">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/80" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="ml-4 flex-1 rounded-lg bg-white/5 px-3 py-1.5 text-center text-xs text-neutral-500 sm:text-sm">
            arena.altai.com
          </div>
        </div>
        {/* App content */}
        <div className="p-4 sm:p-6 md:p-8">
          <div className="mb-6 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-white sm:text-xl">Leaderboard</h3>
            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-medium text-violet-300 sm:text-sm">
              This week
            </span>
          </div>
          <div className="space-y-1 rounded-xl bg-white/[0.03] p-2 sm:rounded-2xl sm:p-3">
            {rows.map((row, i) => (
              <div
                key={row.rank}
                className={`flex items-center justify-between rounded-lg px-3 py-2.5 sm:px-4 sm:py-3 ${
                  row.name === "You" ? "bg-violet-500/10 ring-1 ring-violet-500/30" : "bg-white/[0.02]"
                }`}
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-sm font-bold text-neutral-300 sm:h-9 sm:w-9">
                    {row.rank}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-400 to-fuchsia-500 sm:h-9 sm:w-9" />
                    <span className={`text-sm font-medium sm:text-base ${row.name === "You" ? "text-violet-300" : "text-white"}`}>
                      {row.name}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-xs sm:gap-6 sm:text-sm">
                  <span className="text-neutral-400">{row.xp} XP</span>
                  <span className="w-12 text-right text-neutral-500 sm:w-14">Lvl {row.level}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 flex gap-2 sm:mt-6 sm:gap-3">
            <div className="flex-1 rounded-lg bg-white/5 px-3 py-2 text-center text-xs text-neutral-500 sm:text-sm">
              Journeys · Challenges · Jobs
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
