"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }
  return (
    <button
      type="button"
      onClick={handleSignOut}
      className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
    >
      Sign out
    </button>
  );
}
