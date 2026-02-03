"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateUsernameAction(username: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated." };

  const normalized = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
  if (normalized.length < 2) return { error: "Username too short." };

  const { error } = await supabase
    .from("profiles")
    .update({ username: normalized, updated_at: new Date().toISOString() })
    .eq("id", user.id);
  if (error) {
    if (error.code === "23505") return { error: "Username is taken." };
    return { error: error.message };
  }
  revalidatePath("/dashboard");
  return {};
}
