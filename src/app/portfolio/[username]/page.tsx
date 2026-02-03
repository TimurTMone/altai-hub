import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function PortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();
  if (!profile) notFound();

  const { data: progressList } = await supabase
    .from("progress")
    .select("*, journeys(name, slug)")
    .eq("user_id", profile.id);

  const { data: approvedSubmissions } = await supabase
    .from("submissions")
    .select("*, challenges(title, xp_reward), journeys(name, slug)")
    .eq("user_id", profile.id)
    .eq("status", "approved")
    .order("reviewed_at", { ascending: false });

  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto">
      <div className="mb-8">
        <Link href="/" className="text-sm text-neutral-500 hover:underline">
          ← AltAI Hub
        </Link>
      </div>
      <header className="flex items-center gap-4 mb-8">
        {profile.avatar_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={profile.avatar_url}
            alt=""
            className="w-16 h-16 rounded-full object-cover"
          />
        ) : (
          <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center text-xl font-semibold text-neutral-600 dark:text-neutral-300">
            {(profile.full_name ?? profile.username ?? "?")[0].toUpperCase()}
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{profile.full_name ?? profile.username ?? "Anonymous"}</h1>
          <p className="text-neutral-500">@{profile.username}</p>
        </div>
      </header>
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3">Progress by journey</h2>
        {!progressList?.length ? (
          <p className="text-neutral-600 dark:text-neutral-400">No progress yet.</p>
        ) : (
          <ul className="grid gap-3 sm:grid-cols-2">
            {progressList.map((p: { journey_id: string; total_xp: number; level: number; journeys: { name: string; slug: string } | null }) => {
              const journey = Array.isArray(p.journeys) ? p.journeys[0] : p.journeys;
              return (
                <li
                  key={p.journey_id}
                  className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-3"
                >
                  <span className="font-medium">{journey?.name ?? "Journey"}</span>
                  <span className="block text-sm text-neutral-500">
                    {p.total_xp} XP · Level {p.level}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-3">Verified work</h2>
        {!approvedSubmissions?.length ? (
          <p className="text-neutral-600 dark:text-neutral-400">No approved submissions yet.</p>
        ) : (
          <ul className="space-y-3">
            {approvedSubmissions.map((s: {
              id: string;
              challenges: { title: string; xp_reward: number } | null;
              journeys: { name: string; slug: string } | null;
              score: number | null;
              feedback: string | null;
              links: string[];
            }) => {
              const challenge = Array.isArray(s.challenges) ? s.challenges[0] : s.challenges;
              const journey = Array.isArray(s.journeys) ? s.journeys[0] : s.journeys;
              return (
                <li
                  key={s.id}
                  className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4"
                >
                  <p className="font-medium">{challenge?.title ?? "Challenge"}</p>
                  <p className="text-sm text-neutral-500">
                    {journey?.name ?? "Journey"}
                    {challenge?.xp_reward != null && ` · ${challenge.xp_reward} XP`}
                    {s.score != null && ` · Score: ${s.score}`}
                  </p>
                  {s.feedback && (
                    <p className="text-sm mt-2 text-neutral-600 dark:text-neutral-400">{s.feedback}</p>
                  )}
                  {s.links?.length > 0 && (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {s.links.map((href, i) => (
                        <li key={i}>
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                          >
                            Link {i + 1}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
