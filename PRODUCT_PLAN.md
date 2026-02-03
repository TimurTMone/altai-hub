# AltAI Hub – Product plan (for AI assistants)

Use this doc to brief ChatGPT or other AI tools so they can suggest next challenges, prompts, or features.

---

## Vision

**AltAI Hub** is a proof-of-skill SaaS platform where users:
- Go on **skill journeys** (learning paths)
- Complete **real challenges** (submit links, text, files)
- Build a **public verified portfolio**
- Earn **XP and levels** and appear on a **leaderboard**
- Unlock **jobs** (companies pay to list roles)

**Monetization from day one:** Jobs section — companies pay to post job listings. Future: Stripe subscriptions for premium journeys or features.

---

## Stack

- **Next.js 14** (App Router), **TypeScript**, **Tailwind CSS**
- **Supabase** (Auth, Database, Storage)
- **Stripe** (placeholder for later subscriptions)
- **Vercel** (deploy)

---

## What’s built (MVP)

### Database (Supabase)

- **profiles** — id, username, full_name, avatar_url, role (user | admin), created_at, updated_at. Trigger creates profile on signup.
- **journeys** — id, slug, name, description, image_url, order_index.
- **challenges** — id, journey_id, level, title, description, xp_reward, order_index.
- **submissions** — user_id, challenge_id, links (jsonb), text, file_urls (jsonb), status (pending | approved | rejected), score, feedback, reviewed_at, reviewed_by.
- **progress** — user_id, journey_id, total_xp, level. Updated by **trigger when a submission is set to approved** (adds xp_reward to total_xp, recomputes level).
- **RLS** on all tables. `is_admin()` SECURITY DEFINER for admin checks.
- **Storage** bucket `submissions` for file uploads (optional).

### Routes

| Route | Purpose |
|-------|--------|
| `/` | Landing (dark theme, CTAs) |
| `/login`, `/signup` | Auth |
| `/journeys` | Choose your Path — gradient cards per journey |
| `/journey/[slug]` | Journey detail: progress (X completed, Y total, XP), challenge list (completed / in-progress / available) |
| `/challenge/[id]` | Challenge detail: overview, “What you’ll learn,” topics, submit form (links, text, files) |
| `/dashboard` | Your Journey home: progress card, Total XP / Completed / Streak, level bar, Continue Learning, Top Learners |
| `/profile` | Avatar, name, level bar, Total XP / Completed / Streak / Rank, badges (First Steps, Rising Star) |
| `/ranks` | Leaderboard: top 3 podium + list, all-time by total XP |
| `/jobs` | Jobs section — placeholder cards (company, role, apply). Monetization: companies pay to list. |
| `/portfolio/[username]` | Public portfolio: profile, progress by journey, approved submissions |
| `/admin` | Admin home |
| `/admin/review` | Review pending submissions: approve/reject, score, feedback (XP added via DB trigger) |

### UX/UI (current)

- **Dark theme** app-wide. Gradient journey cards (per-slug colors). Mobile-first.
- **Bottom nav** (mobile): Home, Journey, Ranks, Jobs, Profile.
- **Gamification:** XP, level (from total_xp), level progress bar, completed count, streak (0d placeholder), rank, badges (First Steps earned on first approved submission; Rising Star locked until level 10).
- **Leaderboard:** Aggregated total_xp per user across all journeys; top 5 on dashboard, full list on /ranks.

### Journeys (seeded)

1. AI Builder  
2. Prompt Engineering  
3. Content Creator  
4. Vibe Coding  
5. No-Code  
6. **AI for Teachers** (Canva, Coursera, AI lesson plan, quiz/poll, LMS, resource pack challenges)

---

## What to ask ChatGPT next (examples)

- “Suggest 5 new **challenges** for the AI for Teachers journey (with title, description, xp_reward, level).”
- “Suggest 3 new **journeys** for AltAI Hub with slug, name, description and 2–3 challenge ideas each.”
- “Write a Supabase **migration** that adds a new journey called [X] with 4 challenges.”
- “Suggest **prompts** I can use in Cursor to add [feature X] to AltAI Hub (e.g. email on approval, badges table, job application flow).”
- “What **monetization** features should we add next (e.g. paid job posts, premium journeys, certifications)?”
- “Give me **copy** for the Jobs page explaining to companies why they should pay to list roles.”
- “Suggest **badges** and conditions (e.g. ‘Complete 5 challenges in one journey’, ‘Reach 1000 XP’) for the profile page.”

---

## Tech details (for implementation prompts)

- **Auth:** Supabase Auth; session refresh in middleware; protected routes redirect in (app) and admin layouts.
- **Admin:** `profiles.role = 'admin'`; only admins can access /admin and update submission status/score/feedback.
- **XP/level:** On submission `status` → `approved`, DB trigger adds `xp_reward` to `progress.total_xp` for that user/journey and sets `level = compute_level(total_xp)` (e.g. floor(sqrt(total_xp/100)) + 1).
- **One submission per user per challenge** (upsert on user_id, challenge_id).
- **Portfolio:** Public; reads profile by username, progress, and approved submissions with challenge/journey info.

---

## File layout (reference)

- `src/app/(marketing)/page.tsx` — landing  
- `src/app/(auth)/` — login, signup  
- `src/app/(app)/` — dashboard, journeys, journey/[slug], challenge/[id], profile, ranks, jobs  
- `src/app/admin/` — admin, admin/review  
- `src/app/portfolio/[username]/` — public portfolio  
- `src/components/` — layout (AppNav, SignOutButton, SetUsernameForm), journey (JourneyCard, ChallengeRow), challenge (SubmitForm), ui (BottomNav, StatCard, LevelProgressBar), admin (ReviewList)  
- `src/lib/supabase/` — client, server, middleware  
- `supabase/migrations/` — 001_schema, 002_seed, 003_fix_rls, 004_seed_ai_for_teachers  

Use this plan to get consistent suggestions for challenges, migrations, features, and copy from ChatGPT or other AI tools.
