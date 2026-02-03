import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen">
      <nav className="flex items-center gap-6 border-b border-neutral-200 dark:border-neutral-800 px-6 py-4">
        <Link href="/" className="font-semibold">
          AltAI Hub
        </Link>
        <Link href="/admin" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
          Admin
        </Link>
        <Link href="/admin/review" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
          Review submissions
        </Link>
        <Link href="/dashboard" className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
          Dashboard
        </Link>
      </nav>
      <main className="p-6">{children}</main>
    </div>
  );
}
