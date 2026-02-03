import Link from "next/link";
import type { Metadata } from "next";
import { Suspense } from "react";
import { getLandingTranslations, type Locale } from "@/locales/landing";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";
import { HeroVisual } from "@/components/landing/HeroVisual";
import { ProductMockup } from "@/components/landing/ProductMockup";
import { SectionOrb } from "@/components/landing/SectionOrb";
import { ProofLedgerCard } from "@/components/landing/ProofLedgerCard";
import { CompetitionBadges } from "@/components/landing/CompetitionBadges";

const baseUrl =
  process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}): Promise<Metadata> {
  const { lang } = await searchParams;
  const locale: Locale =
    lang === "ru" || lang === "ky" || lang === "en" ? lang : "en";
  const t = getLandingTranslations(locale);
  const canonical = lang ? `/?lang=${lang}` : "/";
  const ogImageUrl = `${baseUrl}/api/og?lang=${locale}`;
  return {
    title: t.meta.title,
    description: t.meta.description,
    openGraph: {
      title: t.meta.title,
      description: t.meta.description,
      url: `${baseUrl}${canonical}`,
      siteName: "AltAI",
      locale:
        locale === "en" ? "en_US" : locale === "ru" ? "ru_RU" : "ky_KG",
      images: [
        { url: ogImageUrl, width: 1200, height: 630, alt: t.meta.title },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: [ogImageUrl],
    },
    alternates: { canonical: `${baseUrl}${canonical}` },
  };
}

export default async function LandingPage({
  searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  const { lang } = await searchParams;
  const locale: Locale =
    lang === "ru" || lang === "ky" || lang === "en" ? lang : "en";
  const t = getLandingTranslations(locale);

  return (
    <div className="min-h-screen bg-[#050508] text-neutral-100">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050508]/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link href="/" className="text-xl font-semibold tracking-tight text-white">
            AltAI
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/journeys"
              className="hidden text-sm text-neutral-400 transition hover:text-white sm:inline"
            >
              {t.nav.arena}
            </Link>
            <Link
              href="/ranks"
              className="hidden text-sm text-neutral-400 transition hover:text-white sm:inline"
            >
              {t.nav.leaderboard}
            </Link>
            <Link
              href="/jobs"
              className="hidden text-sm text-neutral-400 transition hover:text-white sm:inline"
            >
              {t.nav.jobs}
            </Link>
            <Suspense fallback={<div className="h-9 w-24 rounded-lg bg-white/5" />}>
              <LanguageSwitcher />
            </Suspense>
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-400 transition hover:text-white"
            >
              {t.nav.signIn}
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
            >
              {t.nav.getStarted}
            </Link>
          </div>
        </nav>
      </header>

      {/* 1. HERO */}
      <section className="relative overflow-hidden border-b border-white/5">
        <HeroVisual />
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 pt-24 text-center sm:pt-32 md:pt-40">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            {t.hero.headline}
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-neutral-400 sm:text-xl">
            {t.hero.line1}
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-neutral-400 sm:text-xl">
            {t.hero.line2}
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-white/90 sm:text-xl">
            {t.hero.line3}
          </p>
          <div className="mt-14 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-white px-8 py-4 text-lg font-semibold text-black shadow-lg transition hover:bg-neutral-200"
            >
              {t.hero.ctaPrimary}
            </Link>
            <Link
              href="/ranks"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-lg font-medium text-white transition hover:border-white/40 hover:bg-white/10"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
          <p className="mt-10 text-sm text-neutral-500">
            {t.hero.trustLine}
          </p>
        </div>
        <ProductMockup />
      </section>

      {/* 2. MANIFESTO */}
      <section className="relative overflow-hidden border-b border-white/5 py-24 sm:py-32">
        <SectionOrb side="left" className="h-[300px] w-[300px] opacity-15" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.manifesto.title}
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-neutral-400">
            {t.manifesto.courses}
          </p>
          <p className="mt-12 text-xl font-semibold text-white sm:text-2xl">
            {t.manifesto.realWork}
          </p>
        </div>
      </section>

      {/* 3. HOW IT WORKS */}
      <section id="how-it-works" className="relative overflow-hidden border-b border-white/5 py-24 sm:py-32">
        <SectionOrb side="right" className="h-[350px] w-[350px] opacity-10" />
        <div className="relative mx-auto max-w-5xl px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.how.title}
          </h2>
          {/* Visual path: dots and line */}
          <div className="mt-16 hidden items-start justify-between gap-2 lg:flex">
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20 text-2xl font-bold text-violet-400">1</div>
              <h3 className="mt-6 text-xl font-semibold text-white">{t.how.step1}</h3>
              <p className="mt-3 text-sm text-neutral-400">{t.how.step1Desc}</p>
            </div>
            <div className="flex shrink-0 pt-8">
              <div className="h-0.5 w-8 bg-gradient-to-r from-violet-500/50 to-transparent" />
            </div>
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20 text-2xl font-bold text-violet-400">2</div>
              <h3 className="mt-6 text-xl font-semibold text-white">{t.how.step2}</h3>
              <p className="mt-3 text-sm text-neutral-400">{t.how.step2Desc}</p>
            </div>
            <div className="flex shrink-0 pt-8">
              <div className="h-0.5 w-8 bg-gradient-to-r from-violet-500/50 to-transparent" />
            </div>
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20 text-2xl font-bold text-violet-400">3</div>
              <h3 className="mt-6 text-xl font-semibold text-white">{t.how.step3}</h3>
              <p className="mt-3 text-sm text-neutral-400">{t.how.step3Desc}</p>
            </div>
            <div className="flex shrink-0 pt-8">
              <div className="h-0.5 w-8 bg-gradient-to-r from-violet-500/50 to-transparent" />
            </div>
            <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.02] p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/20 text-2xl font-bold text-violet-400">4</div>
              <h3 className="mt-6 text-xl font-semibold text-white">{t.how.step4}</h3>
              <p className="mt-3 text-sm text-neutral-400">{t.how.step4Desc}</p>
            </div>
          </div>
          <div className="mt-12 grid gap-8 sm:mt-20 sm:grid-cols-2 lg:hidden lg:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <span className="text-3xl font-bold text-violet-400">1</span>
              <h3 className="mt-6 text-xl font-semibold text-white">{t.how.step1}</h3>
              <p className="mt-3 text-neutral-400">{t.how.step1Desc}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <span className="text-3xl font-bold text-violet-400">2</span>
              <h3 className="mt-6 text-xl font-semibold text-white">{t.how.step2}</h3>
              <p className="mt-3 text-neutral-400">{t.how.step2Desc}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <span className="text-3xl font-bold text-violet-400">3</span>
              <h3 className="mt-6 text-xl font-semibold text-white">{t.how.step3}</h3>
              <p className="mt-3 text-neutral-400">{t.how.step3Desc}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-8">
              <span className="text-3xl font-bold text-violet-400">4</span>
              <h3 className="mt-6 text-xl font-semibold text-white">{t.how.step4}</h3>
              <p className="mt-3 text-neutral-400">{t.how.step4Desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. COMPETITION ENGINE */}
      <section className="relative overflow-hidden border-b border-white/5 py-24 sm:py-32">
        <SectionOrb side="center" className="h-[280px] w-[280px] opacity-15" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.competition.title}
          </h2>
          <div className="mt-14">
            <CompetitionBadges />
          </div>
          <p className="mx-auto mt-14 max-w-2xl text-xl leading-relaxed text-white">
            {t.competition.reputationLine}
          </p>
        </div>
      </section>

      {/* 5. PORTFOLIO AS PROOF */}
      <section className="relative overflow-hidden border-b border-white/5 py-24 sm:py-32">
        <SectionOrb side="right" className="h-[260px] w-[260px] opacity-10" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.portfolio.title}
          </h2>
          <p className="mt-8 text-lg leading-relaxed text-neutral-400">
            {t.portfolio.sub}
          </p>
          <div className="mt-14">
            <ProofLedgerCard />
          </div>
        </div>
      </section>

      {/* 6. JOBS */}
      <section className="relative overflow-hidden border-b border-white/5 py-24 sm:py-32">
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-white/5">
            <svg className="h-10 w-10 text-violet-400/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.jobs.title}
          </h2>
          <Link
            href="/jobs"
            className="mt-10 inline-block rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-medium text-white transition hover:border-white/40 hover:bg-white/10"
          >
            {t.nav.jobs}
          </Link>
        </div>
      </section>

      {/* 7. IDENTITY */}
      <section className="relative overflow-hidden border-b border-white/5 py-24 sm:py-32">
        <SectionOrb side="left" className="h-[240px] w-[240px] opacity-10" />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <div className="flex justify-center gap-3 sm:gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 sm:h-14 sm:w-14"
                style={{
                  background: `linear-gradient(135deg, rgba(120,80,220,${0.08 + i * 0.03}) 0%, rgba(88,28,135,${0.05 + i * 0.02}) 100%)`,
                }}
              >
                <span className="text-lg font-semibold text-white/60 sm:text-xl">{i}</span>
              </div>
            ))}
          </div>
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            {t.identity.title}
          </h2>
          <p className="mt-6 text-lg text-neutral-400">
            {t.identity.who}
          </p>
          <p className="mt-10 text-xl leading-relaxed text-white">
            {t.identity.believe}
          </p>
        </div>
      </section>

      {/* 8. FINAL CLOSING */}
      <section className="relative overflow-hidden py-24 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-t from-violet-950/15 via-transparent to-transparent pointer-events-none" aria-hidden />
        <div
          className="absolute bottom-0 left-1/2 h-[400px] w-[800px] -translate-x-1/2 translate-y-1/2 rounded-full opacity-20"
          style={{
            background: "radial-gradient(ellipse, rgba(120, 80, 220, 0.35) 0%, transparent 65%)",
            filter: "blur(60px)",
          }}
          aria-hidden
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center">
          <p className="text-2xl font-semibold leading-relaxed text-white sm:text-3xl">
            {t.close.line1}
          </p>
          <p className="mt-6 text-xl text-neutral-400">
            {t.close.line2}
          </p>
          <Link
            href="/signup"
            className="mt-12 inline-block rounded-xl bg-white px-10 py-4 text-lg font-semibold text-black shadow-lg transition hover:bg-neutral-200"
          >
            {t.close.cta}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12">
        <div className="mx-auto max-w-6xl px-4 md:flex md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-500">
            <Link href="/journeys" className="transition hover:text-white">
              {t.footer.arena}
            </Link>
            <Link href="/jobs" className="transition hover:text-white">
              {t.footer.jobs}
            </Link>
            <Link href="/ranks" className="transition hover:text-white">
              {t.footer.rankings}
            </Link>
          </div>
          <p className="mt-6 text-sm text-neutral-600 md:mt-0">
            {t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}
