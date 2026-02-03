import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function JourneyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();
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

  const byLevel = (challenges ?? []).reduce<Record<number, typeof challenges>>(
    (acc, c) => {
      const arr = acc[c.level] ?? [];
      arr.push(c);
      acc[c.level] = arr;
      return acc;
    },
    {}
  );
  const levels = Object.keys(byLevel)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="max-w-4xl">
      <Link href="/journeys" className="text-sm text-neutral-500 hover:underline mb-4 inline-block">
        ← Journeys
      </Link>
      <h1 className="text-2xl font-bold mb-2">{journey.name}</h1>
      {journey.description && (
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          {journey.description}
        </p>
      )}
      {levels.map((level) => (
        <section key={level} className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Level {level}</h2>
          <ul className="space-y-2">
            {(byLevel[level] ?? []).map((c) => (
              <li key={c.id}>
                <Link
                  href={`/challenge/${c.id}`}
                  className="block rounded-lg border border-neutral-200 dark:border-neutral-700 p-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
                >
                  <span className="font-medium">{c.title}</span>
                  <span className="text-neutral-500 text-sm ml-2">
                    {c.xp_reward} XP
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
      {levels.length === 0 && (
        <p className="text-neutral-600 dark:text-neutral-400">
          No challenges in this journey yet.
        </p>
      )}
    </div>
  );
}
