import { createClient } from "@/lib/supabase/server";
import { ReviewList } from "@/components/admin/ReviewList";

export default async function AdminReviewPage() {
  const supabase = await createClient();
  const { data: pending } = await supabase
    .from("submissions")
    .select("*, profiles(username, full_name), challenges(title, xp_reward), journeys(name, slug)")
    .eq("status", "pending")
    .order("created_at", { ascending: true });
  return (
    <div className="max-w-4xl">
      <h1 className="text-2xl font-bold mb-6">Review submissions</h1>
      <ReviewList pending={pending ?? []} />
    </div>
  );
}
