import { createClient } from "@/lib/supabase/server";
import { LEVEL_FORMULA } from "@/lib/constants";

export default async function RanksPage() {
  const supabase = await createClient();
  const { data: progressRows } = await supabase.from("progress").select("user_id, total_xp");
  const xpByUser = (progressRows ?? []).reduce<Record<string, number>>((acc, p) => {
    acc[p.user_id] = (acc[p.user_id] ?? 0) + p.total_xp;
    return acc;
  }, {});
  const sorted = Object.entries(xpByUser).sort(([, a], [, b]) => b - a);
  const topIds = sorted.slice(0, 20).map(([id]) => id);
  const { data: profiles } = topIds.length
    ? await supabase.from("profiles").select("id, username, full_name").in("id", topIds)
    : { data: [] };
  const profileMap = (profiles ?? []).reduce<Record<string, { username: string | null; full_name: string | null }>>((acc, p) => {
    acc[p.id] = { username: p.username, full_name: p.full_name };
    return acc;
  }, {});

  const top3 = sorted.slice(0, 3);
  const rest = sorted.slice(3, 20);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-2">
        <span className="text-3xl">🏆</span>
        <h1 className="text-2xl font-bold text-neutral-100">Leaderboard</h1>
      </div>
      <p className="mt-2 text-neutral-400">All time · Top learners by XP</p>

      <div className="mt-8 flex items-end justify-center gap-2 md:gap-4">
        {top3[1] && (
          <div className="flex flex-1 flex-col items-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-600 text-2xl font-bold text-white">
              {(profileMap[top3[1][0]]?.full_name ?? profileMap[top3[1][0]]?.username ?? "?")[0].toUpperCase()}
            </div>
            <p className="mt-2 truncate text-sm font-medium text-neutral-200" style={{ maxWidth: "100px" }}>
              {profileMap[top3[1][0]]?.full_name ?? profileMap[top3[1][0]]?.username ?? "Anonymous"}
            </p>
            <p className="text-xs text-violet-400">⚡ {(top3[1][1] ?? 0).toLocaleString()}</p>
            <div className="mt-2 h-3 w-16 rounded bg-neutral-600 text-center text-xs leading-3 text-white">2nd</div>
          </div>
        )}
        {top3[0] && (
          <div className="flex flex-1 flex-col items-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 text-2xl font-bold text-white">
              {(profileMap[top3[0][0]]?.full_name ?? profileMap[top3[0][0]]?.username ?? "?")[0].toUpperCase()}
            </div>
            <p className="mt-2 truncate text-sm font-bold text-neutral-100" style={{ maxWidth: "100px" }}>
              {profileMap[top3[0][0]]?.full_name ?? profileMap[top3[0][0]]?.username ?? "Anonymous"}
            </p>
            <p className="text-xs text-violet-400">⚡ {(top3[0][1] ?? 0).toLocaleString()}</p>
            <div className="mt-2 h-4 w-20 rounded bg-amber-500 text-center text-sm font-medium leading-4 text-white">1st</div>
          </div>
        )}
        {top3[2] && (
          <div className="flex flex-1 flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-700 text-xl font-bold text-white">
              {(profileMap[top3[2][0]]?.full_name ?? profileMap[top3[2][0]]?.username ?? "?")[0].toUpperCase()}
            </div>
            <p className="mt-2 truncate text-sm font-medium text-neutral-200" style={{ maxWidth: "100px" }}>
              {profileMap[top3[2][0]]?.full_name ?? profileMap[top3[2][0]]?.username ?? "Anonymous"}
            </p>
            <p className="text-xs text-violet-400">⚡ {(top3[2][1] ?? 0).toLocaleString()}</p>
            <div className="mt-2 h-3 w-16 rounded bg-amber-700 text-center text-xs leading-3 text-white">3rd</div>
          </div>
        )}
      </div>

      <ul className="mt-8 space-y-2">
        {rest.map(([userId, xp], i) => {
          const prof = profileMap[userId];
          const level = LEVEL_FORMULA(xp);
          const rank = i + 4;
          return (
            <li
              key={userId}
              className="flex items-center gap-4 rounded-xl border border-border bg-card p-3"
            >
              <span className="w-6 text-right font-medium text-neutral-400">{rank}</span>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg">
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
      {sorted.length === 0 && (
        <p className="mt-8 text-neutral-400">Complete challenges to see the leaderboard.</p>
      )}
    </div>
  );
}
