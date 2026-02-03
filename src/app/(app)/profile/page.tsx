import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { StatCard } from "@/components/ui/StatCard";
import { LevelProgressBar } from "@/components/ui/LevelProgressBar";
import { LEVEL_FORMULA } from "@/lib/constants";

function xpForLevel(level: number) {
  return (level - 1) ** 2 * 100;
}
function percentToNextLevel(totalXp: number) {
  const level = LEVEL_FORMULA(totalXp);
  const currentFloor = xpForLevel(level);
  const nextFloor = xpForLevel(level + 1);
  return Math.min(100, ((totalXp - currentFloor) / (nextFloor - currentFloor)) * 100);
}

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: progressList } = await supabase
    .from("progress")
    .select("total_xp")
    .eq("user_id", user.id);
  const totalXp = (progressList ?? []).reduce((s: number, p: { total_xp: number }) => s + p.total_xp, 0);
  const globalLevel = LEVEL_FORMULA(totalXp);
  const { count } = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "approved");
  const completedCount = count ?? 0;

  const { data: xpByUser } = await supabase.from("progress").select("user_id, total_xp");
  const agg = (xpByUser ?? []).reduce<Record<string, number>>((acc, p) => {
    acc[p.user_id] = (acc[p.user_id] ?? 0) + p.total_xp;
    return acc;
  }, {});
  const sorted = Object.entries(agg).sort(([, a], [, b]) => b - a);
  const rank = sorted.findIndex(([id]) => id === user.id) + 1 || sorted.length + 1;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral-100">Profile</h1>
      <div className="mt-6 flex flex-col items-center text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-violet-500/30 text-4xl text-violet-300">
          {(profile?.full_name ?? profile?.username ?? "?")[0].toUpperCase()}
        </div>
        <p className="mt-3 text-xl font-semibold text-neutral-100">
          {profile?.full_name ?? profile?.username ?? "Learner"}
        </p>
        <p className="text-sm text-neutral-400">Member since {new Date(profile?.created_at ?? user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
        {profile?.username && (
          <Link
            href={`/portfolio/${profile.username}`}
            className="mt-2 text-sm text-violet-400 hover:underline"
          >
            View public portfolio →
          </Link>
        )}
      </div>

      <div className="mt-8 rounded-xl border border-border bg-card p-4">
        <p className="text-sm text-neutral-400">Level {globalLevel}</p>
        <LevelProgressBar
          currentLevel={globalLevel}
          percentToNext={percentToNextLevel(totalXp)}
        />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <StatCard icon="⚡" value={totalXp} label="Total XP" />
        <StatCard icon="🎯" value={completedCount} label="Completed" />
        <StatCard icon="🔥" value="0d" label="Day Streak" />
        <StatCard icon="🏆" value={`#${rank}`} label="Rank" />
      </div>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-100">Badges</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-card p-4 text-center">
            <p className="text-2xl">🎖️</p>
            <p className="mt-1 font-medium text-neutral-200">First Steps</p>
            <p className="text-xs text-neutral-400">Complete your first challenge</p>
            {completedCount > 0 ? (
              <p className="mt-2 text-xs text-green-400">Earned</p>
            ) : (
              <p className="mt-2 text-xs text-neutral-500">Locked</p>
            )}
          </div>
          <div className="rounded-xl border border-border bg-card/50 p-4 text-center opacity-75">
            <p className="text-2xl">⭐</p>
            <p className="mt-1 font-medium text-neutral-400">Rising Star</p>
            <p className="text-xs text-neutral-500">Reach level 10</p>
            <p className="mt-2 text-xs text-neutral-500">Locked</p>
          </div>
        </div>
      </section>
    </div>
  );
}
