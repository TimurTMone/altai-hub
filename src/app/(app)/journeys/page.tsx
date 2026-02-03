import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { JourneyCard } from "@/components/journey/JourneyCard";

export default async function JourneysPage() {
  const supabase = await createClient();
  const { data: journeys } = await supabase
    .from("journeys")
    .select("*, challenges(id)")
    .order("order_index");
  const countByJourney = (journeys ?? []).map((j) => ({
    ...j,
    challengeCount: Array.isArray(j.challenges) ? j.challenges.length : 0,
  }));
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-neutral-100 md:text-3xl">
        Choose your Path
      </h1>
      <p className="mt-2 text-neutral-400">
        Select a skill journey to begin your competitive learning adventure.
      </p>
      <ul className="mt-8 space-y-4">
        {countByJourney.map((j) => (
          <li key={j.id}>
            <JourneyCard
              slug={j.slug}
              name={j.name}
              description={j.description}
              challengeCount={j.challengeCount}
              href={`/journey/${j.slug}`}
            />
          </li>
        ))}
      </ul>
      {!journeys?.length && (
        <p className="mt-8 text-neutral-400">
          No journeys yet. Check back later.
        </p>
      )}
      <div className="mt-10">
        <Link
          href="/journeys"
          className="block w-full rounded-xl bg-violet-600 py-4 text-center font-semibold text-white transition hover:bg-violet-500"
        >
          Start Your Journey
        </Link>
      </div>
    </div>
  );
}
