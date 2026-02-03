import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ChallengeRow } from "@/components/journey/ChallengeRow";

const gradientClass: Record<string, string> = {
  "ai-builder": "bg-journey-ai",
  "prompt-engineering": "bg-journey-prompt",
  "content-creator": "bg-journey-content",
  "vibe-coding": "bg-journey-vibe",
  "no-code": "bg-journey-nocode",
  "ai-for-teachers": "bg-journey-teachers",
};
const defaultGradient = "bg-gradient-to-br from-violet-600 to-purple-700";

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: journey } = await supabase
    .from("journeys")
    .select("*")
    .eq("slug", slug)
    .single();
  if (!journey) notFound();

  const { data: challenges } = await supabase
    .from("challenges")
    .select("*")
    .eq("journey_id", journey.id)
    .order("level")
    .order("order_index");

  let completedCount = 0;
  let totalXpEarned = 0;
  const submissionByChallenge: Record<string, string> = {};
  if (user) {
    const { data: submissions } = await supabase
      .from("submissions")
      .select("challenge_id, status")
      .eq("user_id", user.id)
      .in("challenge_id", (challenges ?? []).map((c) => c.id));
    (submissions ?? []).forEach((s) => {
      submissionByChallenge[s.challenge_id] = s.status;
      if (s.status === "approved") {
        completedCount += 1;
        const ch = challenges?.find((c) => c.id === s.challenge_id);
        if (ch) totalXpEarned += ch.xp_reward;
      }
    });
  }

  const totalChallenges = challenges?.length ?? 0;
  const bgClass = gradientClass[slug] ?? defaultGradient;

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href="/journeys"
        className="mb-4 inline-block text-sm text-neutral-400 hover:text-neutral-200"
      >
        ← Journeys
      </Link>
      <div className={`rounded-2xl ${bgClass} p-6 text-white shadow-lg`}>
        <h1 className="text-2xl font-bold md:text-3xl">{journey.name}</h1>
        <p className="mt-2 text-white/90">
          {journey.description ?? "Master your skills with real challenges."}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-4 rounded-lg bg-white/10 px-4 py-3 text-sm">
          <span>{completedCount} Completed</span>
          <span>{totalChallenges} Total</span>
          <span>☆ {totalXpEarned} XP Earned</span>
        </div>
      </div>
      <h2 className="mt-8 text-lg font-semibold text-neutral-100">Challenges</h2>
      <ul className="mt-4 space-y-3">
        {(challenges ?? []).map((c, i) => {
          const status = submissionByChallenge[c.id] === "approved"
            ? "completed"
            : submissionByChallenge[c.id] === "pending"
              ? "in_progress"
              : "available";
          return (
            <li key={c.id}>
              <ChallengeRow
                id={c.id}
                title={c.title}
                xpReward={c.xp_reward}
                status={status}
                levelLabel={`Level ${c.level}`}
                index={i}
              />
            </li>
          );
        })}
      </ul>
      {(!challenges || challenges.length === 0) && (
        <p className="mt-6 text-neutral-400">No challenges in this journey yet.</p>
      )}
    </div>
  );
}
