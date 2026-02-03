"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="max-w-md mx-auto p-6 text-center">
      <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
      <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4">
        {error.message}
      </p>
      <div className="flex gap-3 justify-center">
        <button
          onClick={reset}
          className="rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-2 text-sm font-medium"
        >
          Try again
        </button>
        <Link
          href="/dashboard"
          className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-4 py-2 text-sm font-medium"
        >
          Dashboard
        </Link>
      </div>
    </div>
  );
}
