# Vercel checklist (copy-paste)

Open **Project → Settings → Environment Variables**.  
For **each** variable below: tick **Production**, save, then **Deployments → Redeploy**.

| Variable | What to put |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://YOUR_REF.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Full **secret** key from Supabase (Settings → API). Not the publishable key. |
| `FAMILY_PASSWORD` | `1212` (or your family password) |
| `ADMIN_PASSWORD` | `2212529` (or your admin password) — **exact name** `ADMIN_PASSWORD` |
| `SESSION_SECRET` | Long random string (e.g. 32+ hex chars) |

Optional (if you use hashes instead of plain): `FAMILY_PASSWORD_HASH_B64`, `ADMIN_PASSWORD_HASH_B64`.

## After saving

1. **Redeploy** (env only applies after redeploy).
2. Open **`https://YOUR_APP.vercel.app/api/auth/env-check`**  
   You want:
   - `familyPlainPasswordSet`: **true**
   - `adminPlainPasswordSet`: **true**
   - `supabaseUrlAndKeySet`: **true**

## Supabase (for albums)

1. SQL Editor: run `supabase/migrations/001_albums_photos.sql`
2. Storage: bucket name **`memories`** (private)

## Still broken?

- **Admin 2212529**: Add variable **`ADMIN_PASSWORD`** (not `ADMIN_PASS` only — we also accept `ADMIN_PASS`).
- **Albums**: Usually missing/wrong **`SUPABASE_SERVICE_ROLE_KEY`** or URL — must be **full** secret key.
