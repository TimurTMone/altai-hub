import { ImageResponse } from "next/og";
import { getLandingTranslations, type Locale } from "@/locales/landing";

export const runtime = "edge";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get("lang") ?? "en";
  const locale: Locale =
    lang === "ru" || lang === "ky" || lang === "en" ? lang : "en";
  const t = getLandingTranslations(locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(180deg, #0a0a0a 0%, #1a0a1f 50%, #0a0a0a 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: 80,
          }}
        >
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#a78bfa",
              letterSpacing: "-0.02em",
              marginBottom: 48,
            }}
          >
            AltAI
          </div>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.03em",
              lineHeight: 1.1,
              textAlign: "center",
              maxWidth: 900,
            }}
          >
            {t.hero.headline}
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#71717a",
              marginTop: 32,
              textAlign: "center",
              maxWidth: 700,
            }}
          >
            {t.hero.sub}
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
