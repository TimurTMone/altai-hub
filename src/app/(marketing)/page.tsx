import Link from "next/link";
import { Suspense } from "react";
import { getLandingTranslations, type Locale } from "@/locales/landing";
import { LanguageSwitcher } from "@/components/landing/LanguageSwitcher";

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
    <div className="min-h-screen bg-[var(--background)] text-neutral-100">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-border bg-[#0a0a0a]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 md:px-6">
          <Link href="/" className="text-xl font-bold text-white">
            AltAI Hub
          </Link>
          <div className="flex items-center gap-4">
            <a
              href="#how-it-works"
              className="hidden text-sm text-neutral-400 hover:text-white sm:inline"
            >
              {t.nav.howItWorks}
            </a>
            <Link
              href="/journeys"
              className="hidden text-sm text-neutral-400 hover:text-white sm:inline"
            >
              {t.nav.journeys}
            </Link>
            <Link
              href="/jobs"
              className="hidden text-sm text-neutral-400 hover:text-white sm:inline"
            >
              {t.nav.jobs}
            </Link>
            <Suspense fallback={<div className="h-9 w-24 rounded-lg bg-card" />}>
              <LanguageSwitcher />
            </Suspense>
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-300 hover:text-white"
            >
              {t.nav.signIn}
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500"
            >
              {t.nav.getStarted}
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-950/30 to-transparent" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center md:py-28">
          <p className="mb-4 inline-block rounded-full border border-violet-500/50 bg-violet-500/10 px-4 py-1.5 text-sm font-medium text-violet-300">
            {t.hero.badge}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            {t.hero.headline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-neutral-400 md:text-xl">
            {t.hero.subheadline}
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="rounded-xl bg-violet-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-600/25 transition hover:bg-violet-500"
            >
              {t.hero.ctaPrimary}
            </Link>
            <Link
              href="/journeys"
              className="rounded-xl border border-border bg-card/50 px-8 py-4 text-lg font-medium text-neutral-200 transition hover:border-violet-500/50 hover:bg-card"
            >
              {t.hero.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>

      {/* Social proof / stats */}
      <section className="border-b border-border py-12">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-sm font-medium text-neutral-500">
            {t.socialProof.label}
          </p>
          <div className="mt-8 grid grid-cols-3 gap-8">
            <div>
              <p className="text-3xl font-bold text-violet-400 md:text-4xl">
                6+
              </p>
              <p className="mt-1 text-sm text-neutral-400">
                {t.socialProof.stat1}
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-violet-400 md:text-4xl">
                50+
              </p>
              <p className="mt-1 text-sm text-neutral-400">
                {t.socialProof.stat2}
              </p>
            </div>
            <div>
              <p className="text-3xl font-bold text-violet-400 md:text-4xl">
                1
              </p>
              <p className="mt-1 text-sm text-neutral-400">
                {t.socialProof.stat3}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-b border-border py-20">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-center text-3xl font-bold text-white md:text-4xl">
            {t.howItWorks.title}
          </h2>
          <div className="mt-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-border bg-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-lg font-bold text-violet-400">
                1
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {t.howItWorks.step1Title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                {t.howItWorks.step1Desc}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-lg font-bold text-violet-400">
                2
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {t.howItWorks.step2Title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                {t.howItWorks.step2Desc}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-lg font-bold text-violet-400">
                3
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {t.howItWorks.step3Title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                {t.howItWorks.step3Desc}
              </p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/20 text-lg font-bold text-violet-400">
                4
              </span>
              <h3 className="mt-4 text-lg font-semibold text-white">
                {t.howItWorks.step4Title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                {t.howItWorks.step4Desc}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Journeys teaser */}
      <section className="border-b border-border py-20">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {t.journeys.title}
          </h2>
          <p className="mt-4 text-neutral-400">{t.journeys.sub}</p>
          <Link
            href="/journeys"
            className="mt-8 inline-block rounded-xl bg-violet-600 px-8 py-4 font-semibold text-white hover:bg-violet-500"
          >
            {t.journeys.cta}
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <h2 className="text-3xl font-bold text-white md:text-4xl">
            {t.cta.title}
          </h2>
          <p className="mt-4 text-lg text-neutral-400">{t.cta.sub}</p>
          <Link
            href="/signup"
            className="mt-8 inline-block rounded-xl bg-violet-600 px-10 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-600/25 hover:bg-violet-500"
          >
            {t.cta.button}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-6xl px-4 md:flex md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-6 text-sm text-neutral-400">
            <Link href="/journeys" className="hover:text-white">
              {t.footer.journeys}
            </Link>
            <Link href="/jobs" className="hover:text-white">
              {t.footer.jobs}
            </Link>
            <Link href="/ranks" className="hover:text-white">
              {t.footer.rankings}
            </Link>
          </div>
          <p className="mt-6 text-sm text-neutral-500 md:mt-0">
            {t.footer.copyright}
          </p>
        </div>
      </footer>
    </div>
  );
}
