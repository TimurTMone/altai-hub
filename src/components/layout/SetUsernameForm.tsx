"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateUsernameAction } from "@/app/(app)/dashboard/actions";

export function SetUsernameForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const value = username.trim().toLowerCase().replace(/[^a-z0-9_-]/g, "");
    if (!value || value.length < 2) {
      setError("Use 2+ letters, numbers, _ or -");
      return;
    }
    setError(null);
    setLoading(true);
    const result = await updateUsernameAction(value);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6 flex flex-wrap items-center gap-2">
      <label htmlFor="username" className="text-neutral-600 dark:text-neutral-400">
        Choose a portfolio username:
      </label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="jane-doe"
        className="rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1 text-sm w-40"
      />
      <button
        type="submit"
        disabled={loading}
        className="rounded bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-3 py-1 text-sm font-medium disabled:opacity-50"
      >
        {loading ? "Saving…" : "Save"}
      </button>
      {error && <p className="text-sm text-red-600 dark:text-red-400 w-full">{error}</p>}
    </form>
  );
}
