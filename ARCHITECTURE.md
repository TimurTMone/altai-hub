# AltAI Hub – Architecture Plan

CTO-approved layout for Next.js 14 App Router. Simple and production-grade.

---

## 1. Folder structure

```
src/
├── app/
│   ├── (auth)/              # Login, signup – minimal layout
│   ├── (marketing)/         # Landing – public
│   ├── (app)/               # Main app – protected, shared layout + bottom nav
│   ├── admin/               # Admin – protected + role check
│   ├── portfolio/[username]/ # Public portfolio – no app chrome
│   ├── api/                 # Route handlers only (e.g. signout, webhooks)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                  # Primitives: Button, Card, Input, BottomNav, StatCard, etc.
│   ├── layout/              # App shell: AppNav, SignOutButton, SetUsernameForm
│   ├── journey/             # JourneyCard, ChallengeRow
│   ├── challenge/           # SubmitForm
│   └── admin/               # ReviewList, etc.
├── lib/
│   ├── supabase/            # client.ts, server.ts, middleware.ts
│   ├── constants.ts
│   ├── stripe.ts            # Stripe when needed
│   └── utils.ts             # Optional: cn(), formatters – only if reused
├── types/
│   └── database.ts          # DB entity types (Profile, Journey, etc.)
├── schemas/                 # (Add when needed) Zod schemas for forms/API
├── hooks/                   # (Add when needed) useUser, useProgress – only if reused
└── middleware.ts
```

**Rules:**
- **No `features/` or `modules/`** unless the app grows to 20+ routes; route groups + component folders are enough.
- **Colocate** route-specific pieces: `actions.ts` next to the page that uses them; `loading.tsx`, `error.tsx` in the segment.
- **Keep `lib/` thin:** supabase, constants, 1–2 utils. No “services” folder until you have 5+ shared services.

---

## 2. Route groups

| Group | Path | Purpose |
|-------|------|--------|
| `(auth)` | `/login`, `/signup` | Centered layout, no main nav. |
| `(marketing)` | `/` | Landing; public. |
| `(app)` | `/dashboard`, `/journeys`, `/journey/[slug]`, `/challenge/[id]`, `/profile`, `/ranks`, `/jobs` | Protected layout (auth check in layout). Shared header + bottom nav. |
| (none) | `/admin`, `/admin/review` | Protected + admin role in layout. Own nav. |
| (none) | `/portfolio/[username]` | Public; no app chrome. SEO-friendly. |
| (none) | `api/*` | Route handlers. |

**Do not:** put portfolio inside `(app)` (it would get the app nav and auth redirect). Do not add `(dashboard)` or `(admin)` groups unless you need a second layout variant.

---

## 3. Shared UI components strategy

**Three layers:**

1. **`components/ui/`** – Primitives only. Presentational, no app logic. Examples: `Button`, `Card`, `Input`, `BottomNav`, `StatCard`, `LevelProgressBar`. Accept props; no `useRouter` or Supabase here. Add new primitives when the same pattern appears 3+ times.

2. **`components/layout/`** – App shell and auth-aware layout pieces: `AppNav`, `BottomNav` (if it uses pathname), `SignOutButton`, `SetUsernameForm`. These can use hooks and client state.

3. **Domain components** – `components/journey/`, `components/challenge/`, `components/admin/`. Used by specific routes. Can be client or server; import from `@/lib/supabase/server` only in Server Components. Keep forms and interactive bits as Client Components with server actions.

**Rules:**
- Prefer **composition**: small UI pieces composed in pages or in one level of wrapper. No “page component” folder.
- **No barrel `index.ts`** in `components/ui` until you have 10+ primitives; import by file.
- Shared **loading/error** UI: keep `loading.tsx` and `error.tsx` in the route segment; reuse the same design via a shared component in `ui/` if needed (e.g. `<PageSkeleton />`).

---

## 4. Supabase client/server patterns

**Three entry points:**

| File | Use in | When |
|------|--------|------|
| `lib/supabase/client.ts` | Client Components, client-side only | Login, signup, SignOutButton, any browser-only Supabase call. |
| `lib/supabase/server.ts` | Server Components, Route Handlers, Server Actions | All data fetching in pages; mutations in `actions.ts`; API routes. Always `await createClient()` (async). |
| `lib/supabase/middleware.ts` | `src/middleware.ts` | Session refresh only. Called from root middleware; returns response with updated cookies. |

**Rules:**
- **Never** import the server client in a Client Component or in a file that gets bundled for the client.
- **Server:** one `createClient()` per request (no global singleton). Use `await createClient()` in async Server Components and actions.
- **Client:** one `createClient()` per call is fine; it’s a thin wrapper around the browser client.
- **Service role:** if you need it (e.g. admin-only script), create `lib/supabase/service.ts` that uses `SUPABASE_SERVICE_ROLE_KEY`, and use only in server-side code (actions or API routes). Do not expose in client.

**Middleware:** Only refresh session and optionally redirect unauthenticated users from protected paths. Do not fetch profile or run heavy logic in edge middleware.

---

## 5. Types, Zod schemas, DB helpers

**Types (`src/types/`)**
- **`database.ts`** – Entity types matching Supabase tables: `Profile`, `Journey`, `Challenge`, `Submission`, `Progress`. Use for props and return types. Optional: re-export from a generated type if you use Supabase CLI gen.
- **No `index.ts`** unless you have 5+ type files; then a single barrel is fine.
- Keep **API/response types** next to the route or in a small `types/api.ts` only if shared.

**Zod schemas (`src/schemas/`) – add when needed**
- Create when you have **form validation** or **API body validation** (e.g. submit challenge, review submission). One file per domain or one `schemas.ts` if small.
- Examples: `submissionSchema`, `reviewSchema`. Export and use in Server Actions and/or API routes.
- Do not add Zod for every form; start with actions that need strict validation (file size, URL format, score range).

**DB helpers**
- **Default:** write queries inline in Server Components and Server Actions (as you do now). Clear and colocated.
- **Extract when:** the same query is used in 3+ places (e.g. “get journey by slug with challenges”). Then add `lib/db/journeys.ts` (or `lib/queries/journeys.ts`) with functions that take `supabase` and return data. Keep them **plain async functions**, not a class or repository layer.
- **Do not** add a generic “repository” or “data access” layer. No ORM. Supabase client + optional query helpers is enough.

**Summary**

| Concern | Location | When to add |
|--------|----------|-------------|
| Entity types | `src/types/database.ts` | Already done. |
| Enums / shared constants | `src/lib/constants.ts` | Already done. |
| Zod schemas | `src/schemas/*.ts` | When you validate forms or API bodies. |
| Reused queries | `src/lib/db/*.ts` or `lib/queries/*.ts` | When same query in 3+ places. |
| Utils (cn, formatDate) | `src/lib/utils.ts` | When a util is reused 2+ times. |

---

## Checklist (current state)

- [x] Route groups: `(auth)`, `(marketing)`, `(app)`; admin and portfolio separate.
- [x] Supabase: client for browser, server for RSC/actions, middleware for refresh.
- [x] Types in `src/types/database.ts`.
- [x] UI primitives in `components/ui/`, layout in `components/layout/`, domain in `components/{journey,challenge,admin}`.
- [ ] Zod: add `src/schemas/` when you add validated forms/API.
- [ ] DB helpers: add `lib/db/` or `lib/queries/` only when reusing the same query in 3+ places.

Keep this doc updated when you add schemas or query helpers so the codebase stays consistent.
