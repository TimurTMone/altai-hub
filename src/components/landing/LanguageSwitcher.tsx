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
    <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-white/5 p-1">
      {locales.map(({ code, label }) => {
        const isActive = current === code;
        const href = pathname + (code === "en" ? "" : `?lang=${code}`);
        return (
          <Link
            key={code}
            href={href}
            className={`rounded-md px-2.5 py-1.5 text-sm font-medium transition ${
              isActive
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}
