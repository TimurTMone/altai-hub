# Localization (Kyrgyz, English, Russian)

All user-facing copy must be available in **three languages**: English (en), Russian (ru), Kyrgyz (ky).

## Current setup

- **Landing:** `src/locales/landing.ts` — keys for hero, nav, how it works, CTA, footer. Use `getLandingTranslations(locale)`.
- **Locale:** Passed via URL `?lang=ky` | `?lang=ru` | `?lang=en`. Default when missing: `en`.
- **Switcher:** `components/landing/LanguageSwitcher.tsx` — use on any page that needs language toggle.

## Adding new content

1. Add keys to the right locale file (e.g. `landing.ts` or create `auth.ts`, `dashboard.ts`).
2. Add the same keys for `en`, `ru`, and `ky`.
3. In the page/component, read locale from searchParams or cookie, then `getXxxTranslations(locale)` and render `t.key`.

## Extending beyond landing

- For app shell (dashboard, journeys, etc.): add `src/locales/app.ts` and persist locale in cookie so it works across protected routes.
- Re-export `Locale` type and shared helpers from `src/locales/landing.ts` (or a small `src/lib/i18n.ts`) so one import gives locale + t().
