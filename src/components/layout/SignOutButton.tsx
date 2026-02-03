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
      className="whitespace-nowrap px-3 py-2 text-sm text-neutral-400 hover:text-neutral-100 transition"
    >
      Sign out
    </button>
  );
}
