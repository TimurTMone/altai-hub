"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function reviewSubmissionAction({
  submissionId,
  status,
  score,
  feedback,
}: {
  submissionId: string;
  status: "approved" | "rejected";
  score?: number;
  feedback?: string;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") return;

  await supabase
    .from("submissions")
    .update({
      status,
      score: score ?? null,
      feedback: feedback ?? null,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", submissionId);

  revalidatePath("/admin/review");
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}
