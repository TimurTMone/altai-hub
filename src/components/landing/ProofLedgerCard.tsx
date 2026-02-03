export function ProofLedgerCard() {
  const items = [
    { label: "AI Builder Journey", status: "Verified", xp: "+420 XP" },
    { label: "Prompt Engineering", status: "Verified", xp: "+380 XP" },
    { label: "Content Challenge", status: "Verified", xp: "+150 XP" },
  ];

  return (
    <div className="relative mx-auto w-full max-w-md px-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900/80 shadow-xl backdrop-blur-sm">
        <div className="border-b border-white/10 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-wider text-neutral-500">Proof-of-skill ledger</p>
          <p className="mt-0.5 text-sm text-neutral-400">one link · public · verified</p>
        </div>
        <div className="divide-y divide-white/5">
          {items.map((item, i) => (
            <div key={i} className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/20">
                  <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-sm font-medium text-white">{item.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-emerald-400/90">{item.status}</span>
                <span className="text-xs font-medium text-violet-400">{item.xp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
