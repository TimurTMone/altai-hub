# AltAI Hub – Setup guide (beginner-friendly)

Follow these steps in order. If something fails, check the error message and the tips at the bottom.

---

## Step 1: Install Node.js (if you don’t have it)

1. Go to [https://nodejs.org](https://nodejs.org).
2. Download the **LTS** version (e.g. “20.x LTS”).
3. Run the installer and finish the setup.
4. Open a **new** terminal and run:
   ```bash
   node -v
   ```
   You should see something like `v20.x.x`. If you see “command not found”, Node isn’t installed or not in your PATH.

---

## Step 2: Open the project in the terminal

1. Open the **Terminal** app (Mac) or Command Prompt / PowerShell (Windows).
2. Go to the project folder:
   ```bash
   cd "/Users/timurmone/Desktop/AltAI Hub"
   ```
   (Or drag the “AltAI Hub” folder onto the terminal window to paste the path.)

---

## Step 3: Install project dependencies

Run:

```bash
npm install
```

Wait until it finishes (it may take 1–2 minutes). If you see errors about “network” or “EACCES”, check the **Troubleshooting** section at the end.

---

## Step 4: Create a Supabase project

1. Go to [https://supabase.com](https://supabase.com) and sign up or log in.
2. Click **New project**.
3. Choose an organization (or create one).
4. Fill in:
   - **Name:** e.g. `altai-hub`
   - **Database password:** choose a strong password and **save it** somewhere safe.
   - **Region:** pick one close to you.
5. Click **Create new project** and wait until it’s ready (1–2 minutes).

---

## Step 5: Get your Supabase URL and key

1. In the Supabase dashboard, open your project.
2. In the left sidebar, click **Project Settings** (gear icon).
3. Click **API** in the left menu.
4. You’ll see:
   - **Project URL** (e.g. `https://xxxxx.supabase.co`)
   - **Project API keys** → **anon public** (a long string starting with `eyJ...`)
5. Keep this tab open; you’ll copy these in the next step.

---

## Step 6: Add environment variables to the project

1. In your project folder, find the file **`.env.local.example`**.
2. Duplicate it and rename the copy to **`.env.local`**.
   - In the terminal (from the project folder) you can run:
     ```bash
     cp .env.local.example .env.local
     ```
3. Open **`.env.local`** in your editor.
4. Replace the placeholders with your real values:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
   ```
   - Paste your **Project URL** (no space, no quotes).
   - Paste your **anon public** key on the next line.
5. Save the file. **Do not** commit `.env.local` to Git (it’s already in `.gitignore`).

---

## Step 7: Run the database migrations in Supabase

1. In Supabase, click **SQL Editor** in the left sidebar.
2. Click **New query**.
3. Open the file **`supabase/migrations/001_schema.sql`** from this project in your editor.
4. Copy **all** of its contents and paste into the Supabase SQL editor.
5. Click **Run** (or press Ctrl+Enter / Cmd+Enter).
6. Check the result: it should say “Success” with no red errors.
7. Repeat for **`supabase/migrations/002_seed.sql`**: copy all, paste into a **new** query, Run. Again, expect “Success”.

---

## Step 8: Create the Storage bucket (for file uploads)

1. In Supabase, click **Storage** in the left sidebar.
2. Click **New bucket**.
3. **Name:** `submissions`
4. Leave **Public bucket** **on** (so links to uploaded files work).
5. Click **Create bucket**.
6. Click the `submissions` bucket, then **Policies** (or “New policy”).
7. Add a policy so logged-in users can upload:
   - **Policy name:** e.g. `Users can upload to own folder`
   - **Allowed operation:** INSERT (upload)
   - **Target roles:** authenticated
   - **Policy definition (USING):** `true`  
   Or use the template “Allow authenticated uploads” if your dashboard offers it.
8. Save the policy.

(If you’re unsure, you can skip this step at first; the app will work, but file uploads on challenges will fail until the bucket and policy exist.)

---

## Step 9: Run the app

In the terminal (in the project folder), run:

```bash
npm run dev
```

You should see something like:

```text
▲ Next.js 14.x.x
- Local:        http://localhost:3000
```

1. Open a browser and go to **http://localhost:3000**.
2. You should see the AltAI Hub landing page.

---

## Step 10: Create an account and make yourself admin

1. On the site, click **Sign up** (or go to http://localhost:3000/signup).
2. Enter email, password, and name; sign up.
3. Confirm your email if Supabase sent a confirmation link (check project **Authentication → Settings** for “Enable email confirmations”).
4. After logging in, you’ll land on the **Dashboard**. Set a **username** (e.g. `jane-doe`) when asked; this will be your portfolio URL: `/portfolio/jane-doe`.
5. To give yourself **admin** rights (so you can review submissions):
   - In Supabase, go to **Table Editor** → **profiles**.
   - Find your row (your email or user id).
   - Click the cell under **role**, change `user` to **admin**, and save.

Now you can:
- Open **Journeys** and complete challenges.
- Open **Admin → Review submissions** to approve or reject other people’s work.

---

## Quick reference: what runs where

| You run | Where it runs |
|--------|----------------|
| `npm install` | On your computer (installs packages) |
| `npm run dev` | On your computer (starts the app at localhost:3000) |
| SQL migrations | In Supabase (SQL Editor) |
| Storage bucket | In Supabase (Storage) |
| Your data (users, journeys, submissions) | In Supabase (database + storage) |

---

## Troubleshooting

- **“command not found: npm” or “node”**  
  Node.js isn’t installed or isn’t in your PATH. Install Node LTS from nodejs.org and restart the terminal.

- **“Cannot find module…” or “Module not found”**  
  Run `npm install` again from the project folder:  
  `cd "/Users/timurmone/Desktop/AltAI Hub"` then `npm install`.

- **“Invalid API key” or auth errors**  
  Check `.env.local`: correct **Project URL** and **anon** key, no extra spaces or quotes. Restart `npm run dev` after changing `.env.local`.

- **“relation … does not exist”**  
  The database tables weren’t created. Run **001_schema.sql** and **002_seed.sql** in the Supabase SQL Editor (Step 7).

- **Upload fails on challenge submit**  
  Create the **submissions** bucket in Storage and add a policy so authenticated users can upload (Step 8).

- **Port 3000 already in use**  
  Another app is using port 3000. Stop that app, or run the app on another port:  
  `npm run dev -- -p 3001`  
  Then open http://localhost:3001.

- **Blank or broken page**  
  Open the browser **Developer Tools** (F12 or right‑click → Inspect → Console) and check for red errors. Often they’re about missing env vars or failed API calls.

If you’re still stuck, note the **exact** error message (and whether it’s in the terminal, browser console, or Supabase) and use that to search or ask for help.
