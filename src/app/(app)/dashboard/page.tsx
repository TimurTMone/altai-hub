import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SetUsernameForm } from "@/components/layout/SetUsernameForm";
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
  const range = nextFloor - currentFloor;
  if (range <= 0) return 100;
  return ((totalXp - currentFloor) / range) * 100;
}

export default async function DashboardPage() {
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
    .select("*, journeys(name, slug)")
    .eq("user_id", user.id);

  const totalXp = (progressList ?? []).reduce((sum: number, p: { total_xp: number }) => sum + p.total_xp, 0);
  const globalLevel = LEVEL_FORMULA(totalXp);
  const completedChallenges = await supabase
    .from("submissions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "approved");
  const completedCount = completedChallenges.count ?? 0;

  const { data: recentSubmissions } = await supabase
    .from("submissions")
    .select("*, challenges(id, title, journey_id), journeys(slug, name)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  const primaryProgress = progressList?.[0];
  const primaryJourney = primaryProgress?.journeys;
  const journeyData = Array.isArray(primaryJourney) ? primaryJourney[0] : primaryJourney;
  let journeySlug = journeyData?.slug;
  let journeyName = journeyData?.name ?? "AI Builder";
  let journeyIdForNext = primaryProgress?.journey_id;

  if (!journeyIdForNext) {
    const { data: firstJourney } = await supabase
      .from("journeys")
      .select("id, slug, name")
      .order("order_index")
      .limit(1)
      .single();
    if (firstJourney) {
      journeySlug = firstJourney.slug;
      journeyName = firstJourney.name;
      journeyIdForNext = firstJourney.id;
    }
  }

  const { data: nextChallenges } = journeyIdForNext
    ? await supabase
        .from("challenges")
        .select("id, title, xp_reward")
        .eq("journey_id", journeyIdForNext)
        .order("level")
        .order("order_index")
        .limit(1)
    : { data: [] };
  const nextChallenge = nextChallenges?.[0];

  const { data: allProgress } = await supabase.from("progress").select("user_id, total_xp");
  const xpByUser = (allProgress ?? []).reduce<Record<string, number>>((acc, p) => {
    acc[p.user_id] = (acc[p.user_id] ?? 0) + p.total_xp;
    return acc;
  }, {});
  const topUserIds = Object.entries(xpByUser)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([id]) => id);
  const { data: topProfiles } = topUserIds.length
    ? await supabase.from("profiles").select("id, username, full_name").in("id", topUserIds)
    : { data: [] };
  const profileMap = (topProfiles ?? []).reduce<Record<string, { username: string | null; full_name: string | null }>>((acc, p) => {
    acc[p.id] = { username: p.username, full_name: p.full_name };
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral-100 md:text-3xl">
        Your Journey
      </h1>
      {!profile?.username && (
        <div className="mt-4">
          <SetUsernameForm />
        </div>
      )}
      {profile?.username && (
        <p className="mt-2 text-sm text-neutral-400">
          Portfolio:{" "}
          <Link href={`/portfolio/${profile.username}`} className="text-violet-400 hover:underline">
            /portfolio/{profile.username}
          </Link>
        </p>
      )}

      {journeySlug && (
        <Link
          href={`/journey/${journeySlug}`}
          className="mt-6 flex items-center gap-4 rounded-xl border border-border bg-card p-4"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/20 text-2xl">
            🧠
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-neutral-100">{journeyName}</p>
            <p className="text-sm text-neutral-400">
              {primaryProgress ? `${(progressList ?? []).length} journey(s) · ${primaryProgress.total_xp} XP` : "Start your first challenge"}
            </p>
          </div>
          <span className="text-neutral-500">→</span>
        </Link>
      )}

      <div className="mt-6 grid grid-cols-3 gap-3">
        <StatCard icon="⚡" value={totalXp} label="Total XP" />
        <StatCard icon="🎯" value={completedCount} label="Completed" />
        <StatCard icon="🔥" value="0d" label="Streak" />
      </div>

      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <LevelProgressBar
          currentLevel={globalLevel}
          percentToNext={percentToNextLevel(totalXp)}
        />
      </div>

      {nextChallenge && journeySlug && (
        <section className="mt-8">
          <h2 className="text-lg font-semibold text-neutral-100">Continue Learning</h2>
          <Link
            href={`/challenge/${nextChallenge.id}`}
            className="mt-3 flex flex-col gap-3 rounded-xl border border-border bg-card p-5 transition hover:border-violet-500/50"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-xs text-amber-400">
                Next
              </span>
              <span className="text-sm text-violet-400">+{nextChallenge.xp_reward} XP</span>
            </div>
            <p className="font-semibold text-neutral-100">{nextChallenge.title}</p>
            <p className="text-sm text-neutral-400">Complete this challenge to earn {nextChallenge.xp_reward} XP</p>
            <span className="self-end text-sm text-violet-400">Continue →</span>
          </Link>
        </section>
      )}

      <section className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-neutral-100">Top Learners</h2>
          <Link href="/ranks" className="text-sm text-violet-400 hover:underline">
            View All →
          </Link>
        </div>
        <ul className="mt-3 space-y-3">
          {topUserIds.map((userId, i) => {
            const prof = profileMap[userId];
            const xp = xpByUser[userId] ?? 0;
            const rank = i + 1;
            const level = LEVEL_FORMULA(xp);
            return (
              <li
                key={userId}
                className="flex items-center gap-4 rounded-xl border border-border bg-card p-3"
              >
                <span className="text-xl font-bold text-amber-400">{rank}</span>
                <div className="h-10 w-10 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-lg">
                  {(prof?.full_name ?? prof?.username ?? "?")[0].toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-neutral-100">
                    {prof?.full_name ?? prof?.username ?? "Anonymous"}
                  </p>
                  <p className="text-xs text-neutral-400">Level {level}</p>
                </div>
                <p className="text-sm font-medium text-violet-400">{xp.toLocaleString()} XP</p>
              </li>
            );
          })}
        </ul>
        {topUserIds.length === 0 && (
          <p className="mt-4 text-neutral-400">Complete challenges to see rankings.</p>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-lg font-semibold text-neutral-100">Recent submissions</h2>
        {!recentSubmissions?.length ? (
          <p className="mt-2 text-neutral-400">No submissions yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {recentSubmissions.map((s: { id: string; status: string; challenges: { title: string } | null }) => {
              const ch = Array.isArray(s.challenges) ? s.challenges[0] : s.challenges;
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-2"
                >
                  <span className="text-neutral-200">{ch?.title ?? "Challenge"}</span>
                  <span
                    className={`text-sm ${
                      s.status === "approved"
                        ? "text-green-400"
                        : s.status === "rejected"
                          ? "text-red-400"
                          : "text-amber-400"
                    }`}
                  >
                    {s.status}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
