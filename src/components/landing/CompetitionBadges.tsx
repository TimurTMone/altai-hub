export function CompetitionBadges() {
  const badges = [
    { label: "XP", value: "2,840", icon: "◆" },
    { label: "Level", value: "12", icon: "↑" },
    { label: "Badges", value: "8", icon: "★" },
    { label: "Rank", value: "#24", icon: "▣" },
  ];

  return (
    <div className="mx-auto flex max-w-2xl flex-wrap justify-center gap-4 px-4">
      {badges.map((b, i) => (
        <div
          key={i}
          className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-4 backdrop-blur-sm"
        >
          <span className="text-2xl text-violet-400/80">{b.icon}</span>
          <div>
            <p className="text-2xl font-bold text-white sm:text-3xl">{b.value}</p>
            <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">{b.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
