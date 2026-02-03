export function StatCard({
  icon,
  value,
  label,
}: {
  icon: string;
  value: string | number;
  label: string;
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 text-center">
      <p className="text-2xl font-bold text-neutral-100">{value}</p>
      <p className="mt-1 text-xs text-neutral-400">{label}</p>
      <p className="mt-0.5 text-lg opacity-80">{icon}</p>
    </div>
  );
}
