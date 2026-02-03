type Side = "left" | "right" | "center";

export function SectionOrb({ side = "right", className = "" }: { side?: Side; className?: string }) {
  const position =
    side === "left"
      ? "left-[-20%] top-1/2 -translate-y-1/2"
      : side === "center"
        ? "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        : "right-[-20%] top-1/2 -translate-y-1/2";

  return (
    <div
      className={`pointer-events-none absolute h-[400px] w-[400px] rounded-full opacity-20 ${position} ${className}`}
      style={{
        background: "radial-gradient(circle, rgba(120, 80, 220, 0.4) 0%, transparent 65%)",
        filter: "blur(80px)",
      }}
      aria-hidden
    />
  );
}
