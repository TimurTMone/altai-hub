"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { reviewSubmissionAction } from "@/app/admin/review/actions";

type PendingItem = {
  id: string;
  user_id: string;
  challenge_id: string;
  links: string[];
  text: string | null;
  file_urls: string[];
  profiles: { username: string | null; full_name: string | null } | null;
  challenges: { title: string; xp_reward: number } | null;
  journeys: { name: string; slug: string } | null;
};

export function ReviewList({ pending }: { pending: PendingItem[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [score, setScore] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<Record<string, string>>({});

  async function handleReview(
    submissionId: string,
    status: "approved" | "rejected"
  ) {
    setLoadingId(submissionId);
    await reviewSubmissionAction({
      submissionId,
      status,
      score: score[submissionId] ? parseInt(score[submissionId], 10) : undefined,
      feedback: feedback[submissionId] ?? undefined,
    });
    setLoadingId(null);
    router.refresh();
  }

  if (!pending.length) {
    return (
      <p className="text-neutral-600 dark:text-neutral-400">
        No pending submissions.
      </p>
    );
  }

  return (
    <ul className="space-y-6">
      {pending.map((s) => {
        const profile = Array.isArray(s.profiles) ? s.profiles[0] : s.profiles;
        const challenge = Array.isArray(s.challenges) ? s.challenges[0] : s.challenges;
        const journey = Array.isArray(s.journeys) ? s.journeys[0] : s.journeys;
        return (
          <li
            key={s.id}
            className="rounded-lg border border-neutral-200 dark:border-neutral-700 p-4"
          >
            <p className="font-medium">
              {challenge?.title ?? "Challenge"} · {journey?.name ?? "Journey"}
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              By {profile?.full_name ?? profile?.username ?? s.user_id}
            </p>
            {s.links?.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {s.links.map((href, i) => (
                  <li key={i}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Link {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            {s.text && (
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400 whitespace-pre-wrap">
                {s.text}
              </p>
            )}
            {s.file_urls?.length > 0 && (
              <ul className="mt-2 flex flex-wrap gap-2">
                {s.file_urls.map((url, i) => (
                  <li key={i}>
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      File {i + 1}
                    </a>
                  </li>
                ))}
              </ul>
            )}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <input
                type="number"
                min={0}
                max={100}
                placeholder="Score (optional)"
                value={score[s.id] ?? ""}
                onChange={(e) => setScore((prev) => ({ ...prev, [s.id]: e.target.value }))}
                className="w-24 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1 text-sm"
              />
              <input
                type="text"
                placeholder="Feedback (optional)"
                value={feedback[s.id] ?? ""}
                onChange={(e) => setFeedback((prev) => ({ ...prev, [s.id]: e.target.value }))}
                className="flex-1 min-w-[200px] rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-2 py-1 text-sm"
              />
              <button
                type="button"
                onClick={() => handleReview(s.id, "approved")}
                disabled={!!loadingId}
                className="rounded bg-green-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loadingId === s.id ? "…" : "Approve"}
              </button>
              <button
                type="button"
                onClick={() => handleReview(s.id, "rejected")}
                disabled={!!loadingId}
                className="rounded bg-red-600 text-white px-3 py-1.5 text-sm font-medium hover:bg-red-700 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
