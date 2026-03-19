# Family Memories

A web-based family photo album app. Share one link (or QR code) with your family; they enter a password to view albums. You manage albums and uploads via a separate admin area.

## Features

- **Family view**: One link → enter password → browse albums (e.g. Raya 2024, Family Day 2025) → tap an album → masonry photo grid with full-screen lightbox (swipe on mobile).
- **Admin**: Create albums, reorder them, delete albums (and storage files), upload multiple photos per album. Password-protected; only you use it.
- **Light blue theme**, mobile-first, interactive (animations, hover states).

## Tech stack

- **Next.js 14** (App Router), TypeScript, Tailwind CSS
- **Supabase**: Postgres (albums, photos) + Storage (images)
- **Auth**: Shared family password + admin password; httpOnly session cookies (JWT via `jose`), bcrypt for password hashes

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run the migrations (in order):
   - `supabase/migrations/001_albums_photos.sql`
   - `supabase/migrations/002_album_sort_order.sql` (album order + admin reorder)
3. Create a Storage bucket:
   - Go to Storage → New bucket.
   - Name: `memories`.
   - Set to **Private** (the app uses signed URLs via the API).
4. In Project Settings → API:
   - Copy **Project URL** and **service_role** key (keep the latter secret).

### 2. Environment variables

Copy the example env file and fill in values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (secret) |
| `FAMILY_PASSWORD_HASH_B64` | Base64 of the bcrypt hash for the family password (recommended; raw `$2b$...` breaks in `.env`) |
| `ADMIN_PASSWORD_HASH_B64` | Base64 of the bcrypt hash for the admin password |
| `FAMILY_PASSWORD_HASH` / `ADMIN_PASSWORD_HASH` | Optional raw bcrypt hashes if your host supports `$` in env |
| `SESSION_SECRET` | Random string for signing cookies (e.g. `openssl rand -hex 32`) |

### 3. Generate password hashes

Run (with Node available):

```bash
npm install
npm run hash-password "your-family-password"
```

After `npm run hash-password`, base64 the printed hash and set `FAMILY_PASSWORD_HASH_B64` / `ADMIN_PASSWORD_HASH_B64`:

```bash
node -e "console.log(Buffer.from('PASTE_BCRYPT_HASH_HERE').toString('base64'))"
```

Paste the output into `.env.local`. (Next.js expands `$` in env files, which corrupts raw bcrypt strings.)

### 4. Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). You’ll see the family login; use your family password. For admin, go to [http://localhost:3000/admin](http://localhost:3000/admin) and sign in with the admin password.

## Deploy (Vercel)

1. Push the project to GitHub (or another Git provider).
2. In [Vercel](https://vercel.com), import the repo.
3. Add the same environment variables as in `.env.local` (Vercel → Project → Settings → Environment Variables).
4. Deploy. Your app will be at `https://your-project.vercel.app`.

## QR code for family

Use your production URL (e.g. `https://your-family-memories.vercel.app`) as the single link for family. To get a QR code:

1. Use any free “URL to QR code” generator (e.g. [qr-code-generator.com](https://www.qr-code-generator.com/) or similar).
2. Paste your production URL and download/print the QR.
3. Family can open the link on their phone or scan the QR to reach the password screen, then view memories.

## Project structure (summary)

- `src/app/` — Routes: `/` (redirect), `/login`, `/gallery`, `/gallery/[id]`, `/admin`, `/admin/login`, `/admin/albums`, `/admin/albums/[id]`.
- `src/app/api/` — Auth (login, admin, logout), albums CRUD, photos list/upload.
- `src/components/` — LoginForm, AlbumList, AlbumCard, PhotoGrid, Admin forms, LogoutButton.
- `src/lib/` — Supabase server client, auth (session, cookies, bcrypt).
- `supabase/migrations/` — SQL for `albums` and `photos` tables.

## Security notes

- The **family password** is shared; anyone who has it can view. Rotate it if it’s ever leaked.
- **Admin password** is only for you; there is no signup.
- All data is read/written through Next.js API routes using the Supabase **service role** on the server; the key is never exposed to the browser.
