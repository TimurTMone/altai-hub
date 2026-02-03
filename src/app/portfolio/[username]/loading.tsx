export default function PortfolioLoading() {
  return (
    <div className="min-h-screen p-6 max-w-3xl mx-auto animate-pulse">
      <div className="h-4 w-24 bg-neutral-200 dark:bg-neutral-700 rounded mb-8" />
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-neutral-200 dark:bg-neutral-700" />
        <div className="h-6 w-48 bg-neutral-200 dark:bg-neutral-700 rounded" />
      </div>
      <div className="h-6 w-40 bg-neutral-200 dark:bg-neutral-700 rounded mb-4" />
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
