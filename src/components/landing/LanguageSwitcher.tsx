"use client";

import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";

const locales = [
  { code: "en" as const, label: "EN" },
  { code: "ru" as const, label: "RU" },
  { code: "ky" as const, label: "KY" },
];

export function LanguageSwitcher() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("lang") || "en";

  return (
    <div className="flex items-center gap-1 rounded-lg border border-border bg-card/50 p-1">
      {locales.map(({ code, label }) => {
        const isActive = current === code;
        const href = pathname + (code === "en" ? "" : `?lang=${code}`);
        return (
          <Link
            key={code}
            href={href}
            className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-violet-600 text-white"
                : "text-neutral-400 hover:text-neutral-100"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
