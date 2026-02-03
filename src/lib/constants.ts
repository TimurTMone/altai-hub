export const XP_PER_LEVEL_BASE = 100;
export const LEVEL_FORMULA = (totalXp: number) =>
  Math.floor(Math.sqrt(totalXp / XP_PER_LEVEL_BASE)) + 1;

export const JOURNEY_SLUGS = [
  "ai-builder",
  "prompt-engineering",
  "content-creator",
  "vibe-coding",
  "no-code",
] as const;
