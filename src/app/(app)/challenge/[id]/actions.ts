"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const MAX_FILES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function submitChallengeAction(formData: FormData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const challengeId = formData.get("challengeId") as string;
  const text = (formData.get("text") as string)?.trim() ?? null;
  let links: string[] = [];
  try {
    links = JSON.parse((formData.get("links") as string) ?? "[]");
  } catch {
    return { error: "Invalid links." };
  }
  if (!Array.isArray(links) || links.some((l) => typeof l !== "string")) {
    return { error: "Invalid links." };
  }
  links = links.filter(Boolean).slice(0, 10);

  const { data: challenge } = await supabase
    .from("challenges")
    .select("id")
    .eq("id", challengeId)
    .single();
  if (!challenge) return { error: "Challenge not found." };

  const fileUrls: string[] = [];
  for (let i = 0; i < MAX_FILES; i++) {
    const file = formData.get(`file_${i}`) as File | null;
    if (!file?.size) continue;
    if (file.size > MAX_FILE_SIZE) return { error: "File too large (max 5MB each)." };
    const ext = file.name.split(".").pop() ?? "bin";
    const path = `${user.id}/${challengeId}/${crypto.randomUUID()}.${ext}`;
    const { error: uploadErr } = await supabase.storage
      .from("submissions")
      .upload(path, file, { upsert: false });
    if (uploadErr) return { error: "Upload failed: " + uploadErr.message };
    const { data: urlData } = supabase.storage.from("submissions").getPublicUrl(path);
    fileUrls.push(urlData.publicUrl);
  }

  const { error: upsertErr } = await supabase.from("submissions").upsert(
    {
      user_id: user.id,
      challenge_id: challengeId,
      links,
      text,
      file_urls: fileUrls,
      status: "pending",
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,challenge_id" }
  );
  if (upsertErr) return { error: upsertErr.message };

  revalidatePath(`/challenge/${challengeId}`);
  revalidatePath("/dashboard");
  return {};
}
