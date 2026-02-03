import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { SetUsernameForm } from "@/components/layout/SetUsernameForm";

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

  const { data: recentSubmissions } = await supabase
    .from("submissions")
    .select("*, challenges(title)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5);

  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-2">
        Hi{profile?.full_name ? `, ${profile.full_name}` : ""}
      </h1>
      {!profile?.username ? (
        <SetUsernameForm />
      ) : (
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          Portfolio:{" "}
          <Link
            href={`/portfolio/${profile.username}`}
            className="underline hover:no-underline"
          >
            /portfolio/{profile.username}
          </Link>
        </p>
      )}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Your progress</h2>
        {!progressList?.length ? (
          <p className="text-neutral-600 dark:text-neutral-400">
            Start a journey to see progress here.
          </p>
        ) : (
          <ul className="grid gap-4 sm:grid-cols-2">
            {progressList.map((p: { journey_id: string; total_xp: number; level: number; journeys: { name: string; slug: string } | null }) => {
              const journey = Array.isArray(p.journeys) ? p.journeys[0] : p.journeys;
              return (
                <li key={p.journey_id}>
                  <Link
                    href={`/journey/${journey?.slug ?? ""}`}
                    className="block rounded-lg border border-neutral-200 dark:border-neutral-700 p-4"
                  >
                    <span className="font-medium">{journey?.name ?? "Journey"}</span>
                    <span className="block text-sm text-neutral-500 mt-1">
                      {p.total_xp} XP · Level {p.level}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-3">Recent submissions</h2>
        {!recentSubmissions?.length ? (
          <p className="text-neutral-600 dark:text-neutral-400">
            No submissions yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {recentSubmissions.map((s: { id: string; status: string; created_at: string; challenges: { title: string } | null }) => {
              const challenge = Array.isArray(s.challenges) ? s.challenges[0] : s.challenges;
              return (
                <li
                  key={s.id}
                  className="flex items-center justify-between rounded border border-neutral-200 dark:border-neutral-700 px-3 py-2"
                >
                  <span>{challenge?.title ?? "Challenge"}</span>
                  <span
                    className={`text-sm ${
                      s.status === "approved"
                        ? "text-green-600"
                        : s.status === "rejected"
                          ? "text-red-600"
                          : "text-amber-600"
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
