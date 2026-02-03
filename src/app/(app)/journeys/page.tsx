import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function JourneysPage() {
  const supabase = await createClient();
  const { data: journeys } = await supabase
    .from("journeys")
    .select("*")
    .order("order_index");
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Skill journeys</h1>
      {!journeys?.length ? (
        <p className="text-neutral-600 dark:text-neutral-400">
          No journeys yet. Check back later or ask an admin to create some.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {journeys.map((j) => (
            <li key={j.id}>
              <Link
                href={`/journey/${j.slug}`}
                className="block rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              >
                <h2 className="font-semibold">{j.name}</h2>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 line-clamp-2">
                  {j.description ?? "No description."}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
