import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <main className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl font-bold tracking-tight">AltAI Hub</h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400">
          Proof-of-skill platform. Go on skill journeys, complete real challenges,
          build a verified portfolio, and unlock jobs and prizes.
        </p>
        <div className="flex gap-4 justify-center flex-wrap">
          <Link
            href="/signup"
            className="rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-6 py-3 font-medium hover:opacity-90"
          >
            Get started
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-6 py-3 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            Sign in
          </Link>
          <Link
            href="/journeys"
            className="rounded-lg border border-neutral-300 dark:border-neutral-600 px-6 py-3 font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            View journeys
          </Link>
        </div>
      </main>
    </div>
  );
}
