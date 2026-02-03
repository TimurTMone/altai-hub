import Link from "next/link";

type Status = "completed" | "in_progress" | "available" | "locked";

export function ChallengeRow({
  id,
  title,
  xpReward,
  status,
  levelLabel,
  index,
}: {
  id: string;
  title: string;
  xpReward: number;
  status: Status;
  levelLabel?: string;
  index?: number;
}) {
  const isLocked = status === "locked";
  const isCompleted = status === "completed";
  const content = (
    <div
      className={`flex items-center gap-4 rounded-xl border p-4 transition ${
        isLocked
          ? "cursor-not-allowed border-border bg-card/50 opacity-60"
          : "border-border bg-card hover:border-violet-500/50"
      }`}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
        {isCompleted ? "✓" : isLocked ? "🔒" : status === "in_progress" && index != null ? String(index + 1) : "•"}
      </div>
      <div className="min-w-0 flex-1">
        <p className="font-medium text-neutral-100">{title}</p>
        <p className="mt-0.5 flex items-center gap-2 text-sm text-neutral-400">
          {levelLabel && <span>{levelLabel}</span>}
          <span>+{xpReward} XP</span>
        </p>
      </div>
      {!isLocked && <span className="text-neutral-500">→</span>}
    </div>
  );
  if (isLocked) return <div>{content}</div>;
  return <Link href={`/challenge/${id}`}>{content}</Link>;
}
