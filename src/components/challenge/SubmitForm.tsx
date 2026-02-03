"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { submitChallengeAction } from "@/app/(app)/challenge/[id]/actions";

type Submission = {
  id: string;
  status: string;
  links: string[];
  text: string | null;
  file_urls: string[];
  feedback: string | null;
  score: number | null;
} | null;

export function SubmitForm({
  challengeId,
  existingSubmission,
  journeySlug,
}: {
  challengeId: string;
  existingSubmission: Submission;
  journeySlug: string;
}) {
  const router = useRouter();
  const [links, setLinks] = useState<string[]>(existingSubmission?.links?.length ? existingSubmission.links : [""]);
  const [text, setText] = useState(existingSubmission?.text ?? "");
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function addLink() {
    setLinks((prev) => [...prev, ""]);
  }
  function removeLink(i: number) {
    setLinks((prev) => prev.filter((_, idx) => idx !== i));
  }
  function setLink(i: number, v: string) {
    setLinks((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const linkList = links.filter(Boolean);
    const formData = new FormData();
    formData.set("challengeId", challengeId);
    formData.set("text", text);
    formData.set("links", JSON.stringify(linkList));
    files.forEach((f, i) => formData.set(`file_${i}`, f));
    const result = await submitChallengeAction(formData);
    setLoading(false);
    if (result?.error) {
      setError(result.error);
      return;
    }
    router.refresh();
  }

  if (existingSubmission?.status === "approved") {
    return (
      <div className="rounded-lg border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 p-4">
        <p className="font-medium text-green-800 dark:text-green-200">Approved</p>
        {existingSubmission.score != null && (
          <p className="text-sm text-green-700 dark:text-green-300">Score: {existingSubmission.score}</p>
        )}
        {existingSubmission.feedback && (
          <p className="text-sm mt-2">{existingSubmission.feedback}</p>
        )}
      </div>
    );
  }

  if (existingSubmission?.status === "rejected") {
    return (
      <div className="rounded-lg border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 mb-4">
        <p className="font-medium text-red-800 dark:text-red-200">Rejected</p>
        {existingSubmission.feedback && (
          <p className="text-sm mt-2">{existingSubmission.feedback}</p>
        )}
        <p className="text-sm mt-2 text-neutral-600 dark:text-neutral-400">
          You can submit again below.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Links</label>
        {links.map((link, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(i, e.target.value)}
              placeholder="https://..."
              className="flex-1 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2"
            />
            <button
              type="button"
              onClick={() => removeLink(i)}
              className="px-3 py-2 text-neutral-500 hover:text-neutral-700"
            >
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addLink} className="text-sm text-neutral-600 hover:underline">
          + Add link
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Description / notes</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Files (optional)</label>
        <input
          type="file"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 px-3 py-2"
        />
      </div>
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
      {existingSubmission?.status === "pending" && (
        <p className="text-sm text-amber-600 dark:text-amber-400">
          You have a pending submission. Submitting again will replace it.
        </p>
      )}
      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 px-4 py-2 font-medium disabled:opacity-50"
      >
        {loading ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
