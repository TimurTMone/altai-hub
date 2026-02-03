import Link from "next/link";

const PLACEHOLDER_JOBS = [
  {
    id: "1",
    company: "TechCorp AI",
    title: "Junior AI Builder",
    description: "Build AI-powered features. Complete the AI Builder journey to apply.",
    slug: "ai-builder",
    salary: "Competitive",
    type: "Full-time",
  },
  {
    id: "2",
    company: "Prompt Labs",
    title: "Prompt Engineer",
    description: "Design and optimize prompts for production LLM products.",
    slug: "prompt-engineering",
    salary: "$80k–120k",
    type: "Remote",
  },
  {
    id: "3",
    company: "Content Studio",
    title: "AI Content Creator",
    description: "Create viral content with AI workflows. Content Creator journey preferred.",
    slug: "content-creator",
    salary: "Varies",
    type: "Contract",
  },
];

export default function JobsPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="flex items-center gap-2">
        <span className="text-3xl">💼</span>
        <h1 className="text-2xl font-bold text-neutral-100">Jobs</h1>
      </div>
      <p className="mt-2 text-neutral-400">
        Opportunities from companies looking for AltAI Hub skills. Complete journeys to unlock more.
      </p>
      <p className="mt-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-200">
        Companies pay to list jobs here — revenue from day one. Add your own via Admin or integrate a job board API.
      </p>

      <ul className="mt-8 space-y-4">
        {PLACEHOLDER_JOBS.map((job) => (
          <li
            key={job.id}
            className="rounded-xl border border-border bg-card p-5 transition hover:border-violet-500/50"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-neutral-100">{job.title}</p>
                <p className="text-sm text-neutral-400">{job.company}</p>
                <p className="mt-2 text-sm text-neutral-300">{job.description}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-neutral-300">
                    {job.type}
                  </span>
                  <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-neutral-300">
                    {job.salary}
                  </span>
                  <Link
                    href={`/journey/${job.slug}`}
                    className="rounded-full bg-violet-500/20 px-2 py-0.5 text-xs text-violet-300"
                  >
                    {job.slug}
                  </Link>
                </div>
              </div>
              <a
                href="#"
                className="shrink-0 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500"
              >
                Apply
              </a>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-center text-sm text-neutral-500">
        More jobs coming soon. Want to post? Contact us or use Admin.
      </p>
    </div>
  );
}
