import Link from "next/link";
import { SignOutButton } from "./SignOutButton";

export function AppNav() {
  return (
    <nav className="flex items-center gap-6 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
      <Link href="/" className="font-semibold">
        AltAI Hub
      </Link>
      <Link href="/journeys" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
        Journeys
      </Link>
      <Link href="/dashboard" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
        Dashboard
      </Link>
      <Link href="/admin" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
        Admin
      </Link>
      <div className="ml-auto flex gap-4">
        <SignOutButton />
      </div>
    </nav>
  );
}
