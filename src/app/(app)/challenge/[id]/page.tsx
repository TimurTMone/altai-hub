import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SubmitForm } from "@/components/challenge/SubmitForm";

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

  return (
    <div className="max-w-2xl">
      <Link
        href={`/journey/${journey?.slug ?? ""}`}
        className="text-sm text-neutral-500 hover:underline mb-4 inline-block"
      >
        ← {journey?.name ?? "Journey"}
      </Link>
      <h1 className="text-2xl font-bold mb-2">{challenge.title}</h1>
      {challenge.description && (
        <div className="prose dark:prose-invert mb-6 text-neutral-600 dark:text-neutral-400">
          {challenge.description}
        </div>
      )}
      <p className="text-sm text-neutral-500 mb-6">
        Reward: {challenge.xp_reward} XP
        {progress && (
          <> · Your progress: {progress.total_xp} XP (Level {progress.level})</>
        )}
      </p>
      <SubmitForm
        challengeId={id}
        existingSubmission={submission}
        journeySlug={journey?.slug ?? ""}
      />
    </div>
  );
}
