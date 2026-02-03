import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubmitForm } from "@/components/challenge/SubmitForm";

const LEARN_ITEMS = [
  "Core concepts and fundamentals",
  "Practical implementation techniques",
  "Best practices and common patterns",
  "Real-world application examples",
];

export default async function ChallengePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: challenge } = await supabase
    .from("challenges")
    .select("*, journeys(slug, name)")
    .eq("id", id)
    .single();
  if (!challenge) notFound();

  const journey = Array.isArray(challenge.journeys) ? challenge.journeys[0] : challenge.journeys;
  const { data: submission } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", user.id)
    .eq("challenge_id", id)
    .maybeSingle();

  const { data: progress } = await supabase
    .from("progress")
    .select("*")
    .eq("user_id", user.id)
    .eq("journey_id", challenge.journey_id)
    .maybeSingle();

  const difficulty = challenge.level <= 1 ? "Beginner" : challenge.level <= 2 ? "Intermediate" : "Advanced";

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        href={`/journey/${journey?.slug ?? ""}`}
        className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/90 hover:bg-white/20"
      >
        ← {journey?.name ?? "Journey"}
      </Link>

      <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-purple-700 p-6 text-white shadow-lg">
        <span className="inline-block rounded-full bg-amber-500/30 px-2 py-0.5 text-xs font-medium text-amber-200">
          {difficulty}
        </span>
        <h1 className="mt-3 text-2xl font-bold md:text-3xl">{challenge.title}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-white/90">
          <span>~30m</span>
          <span className="flex items-center gap-1">⚡ +{challenge.xp_reward} XP</span>
        </div>
      </div>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-100">
          <span>📖</span> Overview
        </h2>
        <p className="mt-2 text-neutral-300">
          {challenge.description ?? "Complete this challenge to earn XP and level up."}
        </p>
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-100">
          <span>💡</span> What You&apos;ll Learn
        </h2>
        <ul className="mt-3 space-y-2 rounded-xl border border-border bg-card p-4">
          {LEARN_ITEMS.map((item, i) => (
            <li key={i} className="flex items-center gap-2 text-neutral-300">
              <span className="text-green-400">✓</span> {item}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-100">
          <span>📌</span> Topics
        </h2>
        <div className="mt-2 flex flex-wrap gap-2">
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-neutral-300">
            Level {challenge.level}
          </span>
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-neutral-300">
            {challenge.xp_reward} XP
          </span>
        </div>
      </section>

      <div className="mt-10 scroll-mt-24 rounded-xl border border-border bg-card p-6" id="start-challenge">
        <h2 className="text-lg font-semibold text-neutral-100">Submit your work</h2>
        <p className="mt-1 text-sm text-neutral-400">
          Complete this challenge to earn {challenge.xp_reward} XP
          {progress && <> · Your progress: {progress.total_xp} XP (Level {progress.level})</>}
        </p>
        <div className="mt-6">
          <SubmitForm
            challengeId={id}
            existingSubmission={submission}
            journeySlug={journey?.slug ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
