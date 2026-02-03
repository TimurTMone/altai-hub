export default function DashboardLoading() {
  return (
    <div className="max-w-4xl space-y-8">
      <div className="h-8 w-64 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
      <div className="h-24 w-full bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <div key={i} className="h-20 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
        ))}
      </div>
    </div>
  );
}
