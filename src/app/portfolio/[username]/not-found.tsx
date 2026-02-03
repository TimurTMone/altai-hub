import Link from "next/link";

export default function PortfolioNotFound() {
  return (
    <div className="min-h-screen p-6 max-w-2xl mx-auto text-center">
      <h1 className="text-2xl font-bold mb-2">Portfolio not found</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6">
        This username doesn&apos;t exist or hasn&apos;t set up a portfolio yet.
      </p>
      <Link
        href="/"
        className="text-neutral-600 dark:text-neutral-400 hover:underline"
      >
        ← Back to AltAI Hub
      </Link>
    </div>
  );
}
