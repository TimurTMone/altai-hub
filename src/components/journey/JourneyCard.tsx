import Link from "next/link";

const gradientClass: Record<string, string> = {
  "ai-builder": "bg-journey-ai",
  "prompt-engineering": "bg-journey-prompt",
  "content-creator": "bg-journey-content",
  "vibe-coding": "bg-journey-vibe",
  "no-code": "bg-journey-nocode",
  "ai-for-teachers": "bg-journey-teachers",
};

const defaultGradient = "bg-gradient-to-br from-violet-600 to-purple-700";

export function JourneyCard({
  slug,
  name,
  description,
  challengeCount,
  href,
}: {
  slug: string;
  name: string;
  description: string | null;
  challengeCount: number;
  href: string;
}) {
  const bgClass = gradientClass[slug] ?? defaultGradient;
  return (
    <Link
      href={href}
      className={`block rounded-2xl ${bgClass} p-5 text-white shadow-lg transition hover:opacity-95 md:p-6`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-lg font-bold md:text-xl">{name}</h2>
          <p className="mt-1 text-sm text-white/90 line-clamp-2">
            {description ?? "Start your skill journey."}
          </p>
          <p className="mt-3 flex items-center gap-1 text-xs text-white/80">
            <span>⚡</span> {challengeCount} challenges
          </p>
        </div>
        <span className="text-white/70">→</span>
      </div>
    </Link>
  );
}
