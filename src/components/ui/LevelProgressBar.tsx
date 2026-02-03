export function LevelProgressBar({
  currentLevel,
  percentToNext,
}: {
  currentLevel: number;
  percentToNext: number;
}) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-neutral-400">Level {currentLevel}</span>
        <span className="text-neutral-400">{Math.round(percentToNext)}% to Level {currentLevel + 1}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-violet-500 transition-all"
          style={{ width: `${Math.min(100, percentToNext)}%` }}
        />
      </div>
    </div>
  );
}
