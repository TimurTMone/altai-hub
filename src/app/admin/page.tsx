import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Admin</h1>
      <ul className="space-y-3">
        <li>
          <Link
            href="/admin/review"
            className="block rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
          >
            <span className="font-medium">Review submissions</span>
            <span className="block text-sm text-neutral-500 mt-1">
              Approve or reject pending submissions and add score/feedback
            </span>
          </Link>
        </li>
        <li>
          <p className="block rounded-lg border border-neutral-200 dark:border-neutral-700 p-4 text-neutral-500">
            <span className="font-medium">Create journey / challenge</span>
            <span className="block text-sm mt-1">
              Use Supabase dashboard or SQL for now; add UI later if needed
            </span>
          </p>
        </li>
      </ul>
    </div>
  );
}
