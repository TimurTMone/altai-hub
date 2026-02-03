# AltAI Hub

Proof-of-skill platform: skill journeys, real challenges, verified portfolio, jobs and prizes.

## Stack

- **Next.js** 14 (App Router), **TypeScript**, **Tailwind CSS**
- **Supabase** (Auth, Database, Storage)
- **Stripe** (placeholder for subscriptions)
- **Vercel** (deploy)

## Setup

### 1. Install and env

```bash
npm install
cp .env.local.example .env.local
```

Set in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key

### 2. Supabase database

In the Supabase SQL editor, run in order:

1. `supabase/migrations/001_schema.sql` – tables, RLS, triggers (profile on signup, XP on submission approval)
2. `supabase/migrations/002_seed.sql` – journeys and challenges

### 3. Storage bucket

In Supabase Dashboard → Storage:

- Create a bucket named **`submissions`**
- Set it to **Public** if you want direct links to uploaded files, or **Private** and use signed URLs in the app
- Add policy: authenticated users can **upload** to `{user_id}/{challenge_id}/*`; adjust **read** as needed for admin/review

### 4. First admin user

After signing up, set a user as admin in Supabase:

```sql
UPDATE profiles SET role = 'admin' WHERE id = 'your-user-uuid';
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing |
| `/login`, `/signup` | Auth |
| `/journeys` | List journeys |
| `/journey/[slug]` | Journey detail + challenges |
| `/challenge/[id]` | Challenge + submit (links, text, files) |
| `/dashboard` | User progress + recent submissions; set username here |
| `/portfolio/[username]` | Public portfolio (no auth) |
| `/admin` | Admin home |
| `/admin/review` | Review pending submissions (approve/reject + score + feedback) |

## Behaviour

- **Auth:** Session refresh in middleware; app and admin routes require login (redirect in layouts). Admin route also requires `profiles.role = 'admin'`.
- **Submissions:** One per user per challenge (upsert). Files go to Storage `submissions/{userId}/{challengeId}/...`.
- **XP:** When an admin sets a submission to `approved`, a DB trigger adds `xp_reward` to `progress.total_xp` for that user/journey and recomputes `level`.
- **Portfolio:** Public; shows profile, progress per journey, and approved submissions.

## Deploy (Vercel)

- Connect the repo, set env vars (`NEXT_PUBLIC_SUPABASE_*`).
- Optional: `NEXT_PUBLIC_SITE_URL` for post-sign-out redirect.
