export default function JourneysLoading() {
  return (
    <div className="max-w-4xl">
      <div className="h-8 w-48 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mb-6" />
      <ul className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <li key={i} className="h-24 bg-neutral-200 dark:bg-neutral-700 rounded-lg animate-pulse" />
        ))}
      </ul>
    </div>
  );
}
