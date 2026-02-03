export function HeroVisual() {
  return (
    <>
      {/* Large gradient orbs - Apple style */}
      <div
        className="absolute -left-[40%] top-[-20%] h-[80vh] w-[80vw] rounded-full opacity-40"
        style={{
          background: "radial-gradient(circle, rgba(120, 80, 220, 0.35) 0%, rgba(88, 28, 135, 0.15) 40%, transparent 70%)",
          filter: "blur(60px)",
        }}
        aria-hidden
      />
      <div
        className="absolute -right-[30%] top-[10%] h-[60vh] w-[60vw] rounded-full opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.25) 0%, transparent 60%)",
          filter: "blur(80px)",
        }}
        aria-hidden
      />
      <div
        className="absolute left-1/2 top-[40%] h-[50vh] w-[50vw] -translate-x-1/2 rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(139, 92, 246, 0.3) 0%, transparent 65%)",
          filter: "blur(70px)",
        }}
        aria-hidden
      />
      {/* Subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        aria-hidden
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />
    </>
  );
}
