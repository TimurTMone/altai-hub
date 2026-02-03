import Link from "next/link";
import { SignOutButton } from "./SignOutButton";

const navLinks = [
  { href: "/dashboard", label: "Home" },
  { href: "/journeys", label: "Journeys" },
  { href: "/ranks", label: "Rankings" },
  { href: "/jobs", label: "Jobs" },
  { href: "/profile", label: "Profile" },
];

export function AppNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-[#1a1a1a]">
      <nav className="flex items-center justify-between gap-6 px-4 py-3 md:px-6 md:py-4">
        <Link href="/dashboard" className="font-bold text-neutral-100 shrink-0">
          AltAI Hub
        </Link>
        <div className="flex items-center gap-1 overflow-x-auto">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="whitespace-nowrap px-3 py-2 text-sm text-neutral-400 hover:text-neutral-100 transition"
            >
              {label}
            </Link>
          ))}
          <Link
            href="/admin"
            className="whitespace-nowrap px-3 py-2 text-sm text-neutral-500 hover:text-neutral-200 transition"
          >
            Admin
          </Link>
          <SignOutButton />
        </div>
      </nav>
    </header>
  );
}
